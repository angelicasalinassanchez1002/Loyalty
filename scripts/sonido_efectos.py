"""Música + efectos UX/UI del demo de 20 efectos → public/efectos/sonido.wav (62 s)."""
import wave
import numpy as np

SR = 48000
DUR = 62.0
N = int(SR * DUR)
rng = np.random.default_rng(11)

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
    if i < 0:
        x = x[-i:]; i = 0
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

fade = np.ones(N)
fade[: int(SR * 0.5)] = np.linspace(0, 1, int(SR * 0.5))
fade[int(SR * 60.2):] = np.exp(-np.arange(N - int(SR * 60.2)) / (SR * 0.7))
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


def golpe():
    d = t(0.35)
    f = 90 * np.exp(-d * 10) + 40
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(d), 0.002, 0.12) * 1.2 + lp(rng.standard_normal(len(d)), 0.6) * env(len(d), 0.001, 0.03) * 0.6

def vidrio():
    out = np.zeros(int(SR * 1.4))
    for i in range(70):
        d = t(0.25)
        fr = 2500 + rng.random() * 6000
        b = np.sin(2 * np.pi * fr * d) * env(len(d), 0.0005, 0.02 + rng.random() * 0.06)
        st = int(SR * (rng.random() ** 2) * 0.9)
        out[st:st + len(b)] += b * (0.3 + rng.random() * 0.5)
    n = rng.standard_normal(len(out)) * np.exp(-np.arange(len(out)) / (SR * 0.15))
    return out * 0.35 + n * 0.5 + np.pad(golpe(), (0, len(out) - len(golpe()))) * 0.8

def obturador():
    return np.concatenate([click() * 1.2, np.zeros(int(SR * 0.05)), click() * 0.8])

def beep(fr=1900, d=0.09):
    dd = t(d)
    return np.sin(2 * np.pi * fr * dd) * env(len(dd), 0.003, d / 2)

def foco():
    return golpe() * 0.6 + np.pad(lp(rng.standard_normal(int(SR * 0.08)), 0.3) * env(int(SR * 0.08), 0.001, 0.02), (0, int(SR * 0.27)))

def tono_sube(d, f0=200, f1=900):
    dd = t(d); k = dd / d
    return np.sin(2 * np.pi * np.cumsum(f0 + (f1 - f0) * k ** 2) / SR) * k ** 1.5 * 0.5

E = lambda i, fr=0: i * 3 + fr / 30  # efecto i (0-index), cuadro dentro del efecto
for i in range(20):
    add(sfx, whoosh(0.35), E(i) - 0.15, 0.22)
# 1 Orbit
for j in range(4): add(sfx, pop(), E(0, 6 + j * 4), 0.18)
# 2 Chat Takeover
for fr in range(14, 34, 2): add(sfx, tick(), E(1, fr), 0.18)
add(sfx, pop(), E(1, 34), 0.25); add(sfx, whoosh(0.5), E(1, 50), 0.35)
# 3 Frame Escape
add(sfx, golpe(), E(2, 6), 0.25); add(sfx, whoosh(0.4), E(2, 30), 0.3)
# 4 Snap Zoom
for fr in (30, 62): add(sfx, golpe(), E(3, fr), 0.4); add(sfx, click(), E(3, fr), 0.4)
# 5 Checklist Pop
for j in range(4): add(sfx, pop(), E(4, 16 + j * 9), 0.3); add(sfx, tick(), E(4, 22 + j * 9), 0.3)
# 6 Headline Storm
for fr in (8, 16, 24, 32): add(sfx, golpe(), E(5, fr), 0.45)
# 7 Zoom Portal
add(sfx, riser(1.0), E(6, 0), 0.18); add(sfx, whoosh(0.6), E(6, 30), 0.4)
# 8 Growth Curve
add(sfx, tono_sube(1.7), E(7, 14), 0.16); add(sfx, campana([79, 84]), E(7, 66), 0.12)
# 9 Studio Reveal
for fr in (14, 24, 38): add(sfx, foco(), E(8, fr), 0.5)
# 10 B-roll Overlay
for j in range(6): add(sfx, click(), E(9, 8 + j * 3), 0.2)
add(sfx, whoosh(0.5), E(9, 52), 0.3)
# 11 Paper Cutout
add(sfx, whoosh(0.3), E(10, 6), 0.35); add(sfx, pop(), E(10, 16), 0.35)
# 12 Dolly Zoom
add(sfx, riser(2.4), E(11, 8), 0.12)
# 13 Magazine Cover
add(sfx, obturador(), E(12, 6), 0.45); add(sfx, pop(), E(12, 34), 0.3)
# 14 Liquid Glass
add(sfx, tono_sube(2.5, 300, 520), E(13, 2), 0.1)
# 15 Zoom Through Cut
add(sfx, riser(0.7), E(14, 19), 0.3); add(sfx, golpe(), E(14, 40), 0.5)
# 16 Green Screen
add(sfx, click(), E(15, 10), 0.4); add(sfx, whoosh(0.6), E(15, 40), 0.3)
# 17 Frame Break
add(sfx, vidrio(), E(16, 22), 0.55)
# 18 Digital Zoom
add(sfx, beep(), E(17, 2), 0.25); add(sfx, beep(2400, 0.06), E(17, 22), 0.22); add(sfx, beep(2400, 0.06), E(17, 25), 0.22)
# 19 Phone Mockup
add(sfx, whoosh(0.5), E(18, 6), 0.3)
for j in range(3): add(sfx, pop(), E(18, 34 + j * 4), 0.25)
# 20 Checklist
for j in range(20): add(sfx, tick(), E(19, 8 + j * 2.8), 0.25)
add(sfx, campana([72, 76, 79, 84], 0.06), E(19, 64), 0.18)

mezcla = mus * fade * 0.7 + sfx * 0.95
mezcla = np.tanh(mezcla * 1.1) * 0.85
mezcla = mezcla / np.max(np.abs(mezcla)) * 0.89
st = (np.clip(np.stack([mezcla, mezcla], 1), -1, 1) * 32767).astype(np.int16)
with wave.open('public/efectos/sonido.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes())
print('ok', len(st) / SR)
