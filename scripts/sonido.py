"""Música de fondo + efectos UX/UI compuestos por código.
Lee scripts/eventos.json (generado por eventos.mjs) y escribe public/v2/sonido.wav (35 s, 48 kHz, estéreo)."""
import json, wave
import numpy as np

SR = 48000
DUR = 35.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
ev = json.load(open('scripts/eventos.json'))

def t(d):
    return np.arange(int(SR * d)) / SR

def env(n, a=0.005, r=None):
    e = np.ones(n)
    na = max(1, int(SR * a))
    e[:na] = np.linspace(0, 1, na)
    if r is None:
        return e
    return e * np.exp(-np.arange(n) / (SR * r))

def add(buf, x, at, g=1.0):
    i = int(at * SR)
    if i >= len(buf):
        return
    x = x[: len(buf) - i]
    buf[i:i + len(x)] += x * g

def lp(x, a):  # filtro pasa-bajos de un polo (a cercano a 1 = más oscuro)
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc = a * acc + (1 - a) * v; y[i] = acc
    return y

def hz(nota):  # MIDI → Hz
    return 440 * 2 ** ((nota - 69) / 12)

# ---------- Música: 96 BPM, Do–Sol–Lam–Fa ----------
mus = np.zeros(N)
BPM = 96; beat = 60 / BPM; compas = 4 * beat
acordes = [[48, 55, 60, 64], [43, 55, 59, 62], [45, 57, 60, 64], [41, 53, 57, 60]]
n_comp = int(DUR / compas) + 1
for c in range(n_comp):
    ac = acordes[c % 4]; t0 = c * compas
    # pad suave
    d = t(compas + 0.4)
    pad = sum(np.sin(2 * np.pi * hz(n + 12) * d) * 0.5 + np.sin(2 * np.pi * hz(n + 12) * 1.003 * d) * 0.5 for n in ac[1:])
    e = np.minimum(1, d / 0.5) * np.minimum(1, (compas + 0.4 - d) / 0.5)
    add(mus, pad * e * 0.035, t0)
    # bajo
    db = t(beat * 1.8)
    add(mus, np.sin(2 * np.pi * hz(ac[0]) * db) * env(len(db), 0.01, 0.5) * 0.16, t0)
    add(mus, np.sin(2 * np.pi * hz(ac[0]) * db) * env(len(db), 0.01, 0.4) * 0.11, t0 + 2.5 * beat)
    # arpegio tipo pluck en corcheas
    arp = [ac[1] + 24, ac[2] + 12, ac[3] + 12, ac[2] + 24]
    for j in range(8):
        dn = t(0.35)
        nota = hz(arp[j % 4])
        pl = (np.sin(2 * np.pi * nota * dn) + 0.3 * np.sin(4 * np.pi * nota * dn)) * env(len(dn), 0.002, 0.09)
        add(mus, pl * 0.05, t0 + j * beat / 2)
    # pulso suave (kick ligero) y hi-hat
    for j in range(4):
        dk = t(0.25)
        f = 110 * np.exp(-dk * 18) + 45
        kick = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(dk), 0.002, 0.08)
        if c > 0:
            add(mus, kick * 0.18, t0 + j * beat)
        dh = t(0.05)
        hat = np.diff(rng.standard_normal(len(dh) + 1)) * env(len(dh), 0.001, 0.012)
        add(mus, hat * 0.025, t0 + j * beat + beat / 2)
# entrada y salida de la música
fade = np.ones(N)
fade[: int(SR * 0.6)] = np.linspace(0, 1, int(SR * 0.6))
fin = ev['final'][0]
i_fin = int(SR * (fin + 0.3))
fade[i_fin:] = np.exp(-np.arange(N - i_fin) / (SR * 0.9))

# ---------- Efectos UX/UI ----------
sfx = np.zeros(N)

def whoosh(d=0.45):
    x = rng.standard_normal(int(SR * d))
    k = np.linspace(0, 1, len(x))
    e = np.sin(np.pi * k) ** 2
    a = 0.97 - 0.25 * np.sin(np.pi * k)  # se abre y se cierra
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc = a[i] * acc + (1 - a[i]) * v; y[i] = acc
    return y * e * 2.2

def tick():
    d = t(0.03)
    return (np.sin(2 * np.pi * 2600 * d) * 0.6 + rng.standard_normal(len(d)) * 0.25) * env(len(d), 0.0005, 0.006)

def click():
    d = t(0.06)
    return (np.sin(2 * np.pi * 1400 * d) + 0.5 * np.sin(2 * np.pi * 3100 * d)) * env(len(d), 0.0005, 0.012)

def pop():
    d = t(0.14)
    f = 500 + 900 * np.exp(-d * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(d), 0.002, 0.04)

def campana(notas, sep=0.08):
    out = np.zeros(int(SR * (0.9 + sep * len(notas))))
    for i, n in enumerate(notas):
        d = t(0.9)
        b = (np.sin(2 * np.pi * hz(n) * d) + 0.35 * np.sin(2 * np.pi * hz(n) * 2.76 * d)) * env(len(d), 0.002, 0.28)
        out[int(SR * sep * i):int(SR * sep * i) + len(b)] += b
    return out

def imprime():
    out = np.zeros(int(SR * 0.75))
    for i in range(18):
        d = t(0.02)
        b = rng.standard_normal(len(d)) * env(len(d), 0.0005, 0.004)
        out[int(SR * i * 0.038):int(SR * i * 0.038) + len(b)] += b
    return lp(out, 0.55) * 1.6

def riser(d=1.2):
    x = rng.standard_normal(int(SR * d)); k = np.linspace(0, 1, len(x))
    a = 0.995 - 0.25 * k
    y = np.empty_like(x); acc = 0.0
    for i, v in enumerate(x):
        acc = a[i] * acc + (1 - a[i]) * v; y[i] = acc
    tono = np.sin(2 * np.pi * np.cumsum(200 + 700 * k ** 2) / SR) * 0.25
    return (y * 2.5 + tono) * k ** 2

for s in ev['whoosh']: add(sfx, whoosh(), s - 0.2, 0.32)
for s in ev['tick']: add(sfx, tick(), s, 0.22)
for s in ev['click']: add(sfx, click(), s, 0.3)
for s in ev['pop']: add(sfx, pop(), s, 0.28)
for s in ev['exito']: add(sfx, campana([76, 83]), s, 0.12)
for s in ev['imprime']: add(sfx, imprime(), s + 0.05, 0.35)
for s in ev['riser']: add(sfx, riser(), s, 0.16)
for s in ev['final']: add(sfx, campana([72, 76, 79, 84], 0.06), s, 0.14)

mezcla = mus * fade * 0.8 + sfx * 0.9
mezcla = np.tanh(mezcla * 1.1) * 0.85
pico = np.max(np.abs(mezcla))
mezcla = mezcla / pico * 0.89
# estéreo con un poco de amplitud para la música
izq = mezcla + np.roll(mus * fade, 480) * 0.03
der = mezcla - np.roll(mus * fade, 480) * 0.03
st = np.stack([izq, der], 1)
st = (np.clip(st, -1, 1) * 32767).astype(np.int16)
with wave.open('public/v2/sonido.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
print('ok', len(st) / SR, 's')
