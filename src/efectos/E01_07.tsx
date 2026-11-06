import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CARA, CL, DUR, EXPO, EXPO_IO, Escena, FONT, IC, Ico, K, Plano, Silueta, ease, t01} from './base';

/* 01 · Orbit — íconos que giran alrededor de la persona, con profundidad */
export const Orbit: React.FC = () => {
  const f = useCurrentFrame();
  const iconos = [IC.cc, IC.tijeras, IC.mic, IC.play];
  const entra = t01(f, 4, 24);
  const items = iconos.map((d, i) => {
    const a = f / 16 + (i / iconos.length) * Math.PI * 2;
    const z = Math.sin(a);
    return {d, i, x: CARA.x + Math.cos(a) * 400 * entra, y: CARA.y - 60 + z * 110 * entra, z};
  });
  const atras = items.filter((o) => o.z < 0);
  const adelante = items.filter((o) => o.z >= 0);
  const chip = (o: (typeof items)[number]) => {
    const s = (0.75 + 0.25 * (o.z + 1)) * entra;
    return (
      <div key={o.i} style={{position: 'absolute', left: o.x - 70, top: o.y - 70, width: 140, height: 140, borderRadius: 40, background: o.i % 2 ? K.tinta : K.morado, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${s})`, filter: `blur(${o.z < 0 ? -o.z * 4 : 0}px)`, boxShadow: '0 20px 40px rgba(33,33,53,0.3)'}}>
        <Ico d={o.d} size={70} />
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Escena />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <ellipse cx={CARA.x} cy={CARA.y - 60} rx={400 * entra} ry={110 * entra} fill="none" stroke={K.morado} strokeWidth={3} strokeDasharray="4 14" opacity={0.5} />
      </svg>
      {atras.map(chip)}
      <div style={{position: 'absolute', left: 140, top: 920}}>
        <Silueta />
      </div>
      {adelante.map(chip)}
    </AbsoluteFill>
  );
};

/* 02 · Chat Takeover — ventana de chat con el prompt y el video adjunto; el video sale de la ventana */
export const ChatTakeover: React.FC = () => {
  const f = useCurrentFrame();
  const ventana = t01(f, 2, 18);
  const sale = t01(f, 52, 22, EXPO_IO);
  const tipo = Math.min(1, Math.max(0, (f - 14) / 20));
  const prompt = 'Edita mi video y agrégale 20 efectos';
  // miniatura dentro del chat: x 190, y 920, 300×420 → pantalla completa
  const mx = interpolate(sale, [0, 1], [646, 0]);
  const my = interpolate(sale, [0, 1], [700 + (1 - ventana) * 300, 0]);
  const mw = interpolate(sale, [0, 1], [300, 1080]);
  const mh = interpolate(sale, [0, 1], [420, 1920]);
  return (
    <AbsoluteFill style={{background: K.tinta}}>
      <Plano oscura />
      <AbsoluteFill style={{background: 'rgba(33,33,53,0.75)', backdropFilter: 'blur(14px)'}} />
      <div style={{position: 'absolute', left: 90, top: 380, width: 900, height: 1100, borderRadius: 40, background: K.blanco, boxShadow: '0 60px 120px rgba(0,0,0,0.45)', transform: `translateY(${(1 - ventana) * 300}px) scale(${0.9 + 0.1 * ventana - 0.06 * sale})`, opacity: ventana * (1 - sale * 0.6), fontFamily: FONT, overflow: 'hidden'}}>
        <div style={{height: 110, borderBottom: `2px solid ${K.niebla}`, display: 'flex', alignItems: 'center', padding: '0 44px', gap: 16}}>
          <div style={{width: 22, height: 22, borderRadius: 11, background: K.morado}} />
          <div style={{fontSize: 40, fontWeight: 800, color: K.tinta}}>Claude</div>
        </div>
        <div style={{padding: 44, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 20}}>
          <div style={{background: K.niebla, borderRadius: 28, padding: '24px 30px', fontSize: 40, fontWeight: 600, color: K.tinta, maxWidth: 700}}>
            {prompt.slice(0, Math.round(prompt.length * tipo))}
            <span style={{opacity: tipo < 1 ? 1 : 0, color: K.morado}}>|</span>
          </div>
          <div style={{alignSelf: 'flex-end', width: 300, height: 420, borderRadius: 24, background: K.niebla, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: t01(f, 34, 8)}}>
            <Ico d={IC.clip} size={60} color={K.tinta} />
          </div>
          <div style={{alignSelf: 'flex-start', display: 'flex', gap: 12, padding: '26px 30px', borderRadius: 28, background: 'rgba(137,29,255,0.1)', opacity: t01(f, 42, 8)}}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{width: 16, height: 16, borderRadius: 8, background: K.morado, opacity: 0.4 + 0.6 * Math.abs(Math.sin((f + i * 5) / 6))}} />
            ))}
          </div>
        </div>
      </div>
      {/* el video adjunto que sale de la ventana */}
      {f >= 34 && (
        <div style={{position: 'absolute', left: mx, top: my, width: mw, height: mh, borderRadius: 24 * (1 - sale), overflow: 'hidden', boxShadow: `0 40px 100px rgba(0,0,0,${0.5 * sale})`, opacity: t01(f, 34, 8), filter: `blur(${Math.sin(Math.PI * sale) * 6}px)`}}>
          <div style={{width: 1080, height: 1920, transform: `scale(${mw / 1080})`, transformOrigin: '0 0'}}>
            <Plano />
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};

/* 03 · Frame Escape — el fondo se oscurece y la persona sale de un marco de foto inclinado */
export const FrameEscape: React.FC = () => {
  const f = useCurrentFrame();
  const osc = t01(f, 4, 18);
  const marco = t01(f, 6, 22);
  const escapa = t01(f, 30, 26);
  const rot = -7 * marco;
  return (
    <AbsoluteFill style={{background: K.tinta}}>
      <AbsoluteFill style={{transform: `scale(${1 - 0.4 * marco})`, opacity: 1 - osc}}>
        <Plano />
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 540 - 330, top: 960 - 400, width: 660, height: 860, transform: `rotate(${rot}deg) scale(${0.7 + 0.3 * marco})`, opacity: marco}}>
        {/* foto con borde blanco */}
        <div style={{position: 'absolute', inset: 0, background: K.blanco, borderRadius: 12, boxShadow: '0 40px 90px rgba(0,0,0,0.5)'}} />
        <div style={{position: 'absolute', left: 30, top: 30, right: 30, bottom: 120, overflow: 'hidden', borderRadius: 4}}>
          <div style={{width: 1080, height: 1920, transform: 'scale(0.556) translate(0, -620px)', transformOrigin: '0 0'}}>
            <Escena />
          </div>
        </div>
        {/* persona: recortada abajo y a los lados; arriba puede salir del marco */}
        <div style={{position: 'absolute', left: 30, right: 30, top: -800, bottom: 120, clipPath: `inset(0 ${-escapa * 200}px 0 ${-escapa * 200}px)`}}>
          <div style={{position: 'absolute', left: 0, top: 800 + 160 - escapa * 260, transform: `scale(${1 + escapa * 0.45})`, transformOrigin: '50% 100%'}}>
            <Silueta w={600} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 04 · Snap Zoom — zoom rápido y seco hacia la cara */
export const SnapZoom: React.FC = () => {
  const f = useCurrentFrame();
  const z = ease(f, 30, 35, 1, 2.3, EXPO);
  const z2 = ease(f, 62, 66, 0, 1, EXPO);
  const s = z - (z - 1) * z2;
  const vel = Math.abs(ease(f, 30, 35, 1, 2.3, EXPO) - ease(f - 1, 30, 35, 1, 2.3, EXPO)) + Math.abs(ease(f, 62, 66, 0, 1) - ease(f - 1, 62, 66, 0, 1)) * 1.3;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: `${CARA.x}px ${CARA.y - 40}px`, filter: `blur(${Math.min(18, vel * 40)}px)`}}>
        <Plano />
      </AbsoluteFill>
      <AbsoluteFill style={{background: K.blanco, opacity: f === 31 || f === 63 ? 0.35 : 0}} />
    </AbsoluteFill>
  );
};

/* 05 · Checklist Pop — píldoras con palomita al lado */
export const ChecklistPop: React.FC = () => {
  const f = useCurrentFrame();
  const corre = ease(f, 2, 22, 0, -170);
  const items = ['Edit', 'Captions', 'Música', 'B-roll'];
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${corre}px)`}}>
        <Plano />
      </AbsoluteFill>
      {items.map((t, i) => {
        const a = 16 + i * 9;
        const p = t01(f, a, 14, (x) => 1 - Math.pow(1 - x, 3));
        const over = 1 + 0.12 * Math.sin(Math.min(1, Math.max(0, (f - a) / 10)) * Math.PI);
        const ck = t01(f, a + 6, 10);
        return (
          <div key={t} style={{position: 'absolute', left: 600, top: 860 + i * 180, display: 'flex', alignItems: 'center', gap: 22, background: K.blanco, borderRadius: 999, padding: '22px 44px 22px 22px', boxShadow: '0 20px 40px rgba(33,33,53,0.18)', transform: `scale(${p * over}) translateX(${(1 - p) * 60}px)`, transformOrigin: 'left center', opacity: p, fontFamily: FONT}}>
            <div style={{width: 88, height: 88, borderRadius: 44, background: K.morado, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <svg width={54} height={54} viewBox="0 0 24 24" fill="none" stroke={K.blanco} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} strokeDasharray={`${ck} 1`} />
              </svg>
            </div>
            <div style={{fontSize: 60, fontWeight: 800, color: K.tinta}}>{t}</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* 06 · Headline Storm — cintas de titulares inclinadas que entran de golpe y se enciman */
export const HeadlineStorm: React.FC = () => {
  const f = useCurrentFrame();
  const cintas = [
    {t: 'ÚLTIMA HORA', bg: K.morado, c: K.blanco, rot: -9, y: 520, desde: -1, en: 8},
    {t: 'CLAUDE AHORA EDITA VIDEO', bg: K.blanco, c: K.tinta, rot: 6, y: 760, desde: 1, en: 16},
    {t: 'EN VIVO · EN VIVO · EN VIVO', bg: K.tinta, c: K.blanco, rot: -4, y: 1010, desde: -1, en: 24},
    {t: '20 EFECTOS · 20 EFECTOS', bg: K.morado, c: K.blanco, rot: 11, y: 1260, desde: 1, en: 32},
  ];
  const golpe = cintas.reduce((acc, c) => acc + Math.max(0, 1 - Math.abs(f - c.en - 3) / 3), 0);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${1 + golpe * 0.02})`}}>
        <Plano />
      </AbsoluteFill>
      <AbsoluteFill style={{background: K.tinta, opacity: 0.35 * t01(f, 6, 10)}} />
      {cintas.map((c) => {
        const p = t01(f, c.en, 9, EXPO);
        const des = (f - c.en) * 3;
        return (
          <div key={c.t} style={{position: 'absolute', left: -300, top: c.y, width: 1680, height: 150, background: c.bg, transform: `rotate(${c.rot}deg) translateX(${(1 - p) * c.desde * 1900 + des * c.desde * -1}px)`, display: 'flex', alignItems: 'center', boxShadow: '0 20px 50px rgba(0,0,0,0.35)', overflow: 'hidden'}}>
            <div style={{whiteSpace: 'nowrap', fontFamily: FONT, fontWeight: 800, fontSize: 96, color: c.c, letterSpacing: '-0.01em', paddingLeft: 340}}>
              {c.t} · {c.t}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/* 07 · Zoom Portal — círculo con la persona que se expande como portal, con blur de movimiento */
export const ZoomPortal: React.FC = () => {
  const f = useCurrentFrame();
  const aparece = t01(f, 4, 16);
  const abre = interpolate(f, [30, 54], [0, 1], {...CL, easing: EXPO_IO});
  const r = 180 * aparece + abre * 1300;
  const vel = Math.sin(Math.PI * abre);
  return (
    <AbsoluteFill style={{background: K.tinta, overflow: 'hidden'}}>
      <Plano oscura sinPersona />
      <AbsoluteFill style={{background: 'rgba(33,33,53,0.6)'}} />
      {/* anillos del portal */}
      {[0, 1, 2].map((i) => (
        <div key={i} style={{position: 'absolute', left: 540 - (r + 30 + i * 28), top: CARA.y - 180 - (r + 30 + i * 28), width: (r + 30 + i * 28) * 2, height: (r + 30 + i * 28) * 2, borderRadius: '50%', border: `${6 - i * 2}px solid ${K.morado}`, opacity: (0.8 - i * 0.25) * aparece * (1 - abre * 0.8), transform: `rotate(${f * (i % 2 ? -3 : 3)}deg)`, borderStyle: i === 1 ? 'dashed' : 'solid'}} />
      ))}
      <div style={{position: 'absolute', left: 540 - r, top: CARA.y - 180 - r, width: r * 2, height: r * 2, borderRadius: '50%', overflow: 'hidden', boxShadow: `0 0 80px rgba(137,29,255,${0.8 * (1 - abre)})`, filter: `blur(${vel * 10}px)`}}>
        <div style={{position: 'absolute', left: r - 540, top: r - (CARA.y - 180), width: 1080, height: 1920, transform: `scale(${1.6 - 0.6 * abre})`, transformOrigin: `540px ${CARA.y - 180}px`}}>
          <Plano />
        </div>
      </div>
    </AbsoluteFill>
  );
};
