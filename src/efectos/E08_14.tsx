import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {CARA, CL, EXPO, EXPO_IO, Escena, FONT, K, Plano, Silueta, ease, t01} from './base';

/* 08 · Growth Curve — cuadrícula oscura y una línea que sube de 1× a 10× */
export const GrowthCurve: React.FC = () => {
  const f = useCurrentFrame();
  const fondo = t01(f, 2, 14);
  const p = interpolate(f, [14, 66], [0, 1], {...CL, easing: EXPO_IO});
  const pts = Array.from({length: 60}, (_, i) => {
    const x = i / 59;
    const y = Math.pow(x, 2.6) + Math.sin(x * 18) * 0.025 * x;
    return [120 + x * 840, 1500 - y * 900];
  });
  const vis = pts.slice(0, Math.max(2, Math.round(p * pts.length)));
  const d = vis.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
  const [lx, ly] = vis[vis.length - 1];
  const mult = 1 + 9 * Math.pow(p, 2.6);
  return (
    <AbsoluteFill>
      <Plano />
      <AbsoluteFill style={{opacity: fondo, background: K.tinta, backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.07) 2px, transparent 2px)', backgroundSize: '90px 90px'}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: fondo}}>
        <defs>
          <linearGradient id="gcA" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={K.morado} stopOpacity={0.45} />
            <stop offset="1" stopColor={K.morado} stopOpacity={0} />
          </linearGradient>
          <filter id="gcG"><feGaussianBlur stdDeviation="12" /></filter>
        </defs>
        <path d={`${d} L${lx},1500 L120,1500 Z`} fill="url(#gcA)" />
        <path d={d} stroke={K.morado} strokeWidth={22} fill="none" filter="url(#gcG)" opacity={0.7} />
        <path d={d} stroke={K.morado} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={lx} cy={ly} r={22} fill={K.blanco} stroke={K.morado} strokeWidth={8} />
      </svg>
      <div style={{position: 'absolute', left: 120, top: 1540, fontFamily: FONT, fontWeight: 800, fontSize: 64, color: 'rgba(255,255,255,0.6)', opacity: fondo}}>1×</div>
      <div style={{position: 'absolute', left: Math.min(lx - 60, 560), top: ly - 250, fontFamily: FONT, fontWeight: 800, fontSize: 130, lineHeight: 1, color: K.blanco, opacity: t01(f, 20, 10), whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums'}}>
        {mult.toFixed(mult < 9.95 ? 1 : 0)}×
        <div style={{fontSize: 60, color: K.morado, opacity: t01(f, 62, 8), transform: `translateY(${(1 - t01(f, 62, 12)) * 20}px)`}}>crecimiento</div>
      </div>
    </AbsoluteFill>
  );
};

/* 09 · Studio Reveal — se encienden luces de estudio a los lados y un letrero ON AIR */
export const StudioReveal: React.FC = () => {
  const f = useCurrentFrame();
  const luz = (a: number) => {
    const t = t01(f, a, 6);
    const parpadeo = f > a && f < a + 6 ? (Math.floor(f) % 2 ? 0.3 : 1) : 1;
    return t * parpadeo;
  };
  const L = luz(14);
  const R = luz(24);
  const aire = luz(38);
  return (
    <AbsoluteFill style={{background: '#121220'}}>
      <AbsoluteFill style={{opacity: 0.15 + 0.85 * Math.max(L, R) * 0.9}}>
        <Plano oscura />
      </AbsoluteFill>
      {/* conos de luz */}
      <div style={{position: 'absolute', left: -200, top: 0, width: 900, height: 1920, background: 'radial-gradient(ellipse 60% 70% at 20% 30%, rgba(255,255,255,0.35), rgba(255,255,255,0) 70%)', opacity: L, mixBlendMode: 'screen', transform: 'rotate(12deg)'}} />
      <div style={{position: 'absolute', right: -200, top: 0, width: 900, height: 1920, background: 'radial-gradient(ellipse 60% 70% at 80% 30%, rgba(137,29,255,0.45), rgba(137,29,255,0) 70%)', opacity: R, mixBlendMode: 'screen', transform: 'rotate(-12deg)'}} />
      {/* focos */}
      {[{x: 40, o: L, rot: 30}, {x: 860, o: R, rot: -30}].map((q, i) => (
        <div key={i} style={{position: 'absolute', left: q.x, top: 200, width: 180, height: 130, borderRadius: 24, background: '#2B2B45', transform: `rotate(${q.rot}deg)`, boxShadow: `0 0 ${80 * q.o}px ${30 * q.o}px rgba(255,255,255,${0.35 * q.o})`}}>
          <div style={{position: 'absolute', left: 20, right: 20, bottom: 14, height: 40, borderRadius: 20, background: K.blanco, opacity: 0.2 + 0.8 * q.o}} />
        </div>
      ))}
      {/* ON AIR */}
      <div style={{position: 'absolute', left: 540 - 220, top: 470, width: 440, height: 150, borderRadius: 26, border: `6px solid ${aire > 0.5 ? K.morado : '#3A3A58'}`, background: aire > 0.5 ? 'rgba(137,29,255,0.25)' : '#1A1A2C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 92, letterSpacing: '0.08em', color: aire > 0.5 ? K.blanco : '#3A3A58', boxShadow: `0 0 ${90 * aire}px rgba(137,29,255,${0.8 * aire}), inset 0 0 ${40 * aire}px rgba(137,29,255,${0.6 * aire})`, textShadow: aire > 0.5 ? `0 0 30px ${K.morado}` : undefined}}>
        ON AIR
      </div>
    </AbsoluteFill>
  );
};

/* 10 · B-roll Overlay — interfaz de editor con línea de tiempo que se reduce a ventana */
export const BrollOverlay: React.FC = () => {
  const f = useCurrentFrame();
  const ui = t01(f, 2, 14);
  const red = interpolate(f, [52, 74], [0, 1], {...CL, easing: EXPO_IO});
  const cabeza = interpolate(f, [10, 80], [0.08, 0.86], CL);
  const pistas = [
    {n: 'B-roll', clips: [[0.05, 0.28], [0.4, 0.62], [0.74, 0.95]], c: K.morado},
    {n: 'Talking head', clips: [[0.0, 1.0]], c: '#4A4A6A'},
    {n: 'Música', clips: [[0.0, 0.9]], c: 'rgba(137,29,255,0.35)'},
  ];
  const s = 1 - 0.52 * red;
  return (
    <AbsoluteFill>
      <Plano />
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `translate(${red * 470}px, ${red * 120}px) scale(${s})`, transformOrigin: '100% 0%', borderRadius: 60 * red, overflow: 'hidden', boxShadow: `0 40px 100px rgba(33,33,53,${0.4 * red})`, opacity: ui}}>
        <AbsoluteFill style={{background: '#17172A', fontFamily: FONT}}>
          <div style={{height: 100, display: 'flex', alignItems: 'center', gap: 14, padding: '0 40px', borderBottom: '2px solid rgba(255,255,255,0.06)'}}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{width: 20, height: 20, borderRadius: 10, background: 'rgba(255,255,255,0.18)'}} />
            ))}
            <div style={{marginLeft: 20, color: 'rgba(255,255,255,0.7)', fontSize: 30, fontWeight: 700}}>proyecto.mp4</div>
          </div>
          {/* vista previa */}
          <div style={{position: 'absolute', left: 230, top: 150, width: 620, height: 1100, borderRadius: 18, overflow: 'hidden'}}>
            <div style={{width: 1080, height: 1920, transform: 'scale(0.574)', transformOrigin: '0 0'}}>
              <Plano />
            </div>
          </div>
          {/* línea de tiempo */}
          <div style={{position: 'absolute', left: 40, right: 40, top: 1320, bottom: 60}}>
            {pistas.map((p, i) => (
              <div key={p.n} style={{display: 'flex', alignItems: 'center', height: 150, marginBottom: 20}}>
                <div style={{width: 230, color: 'rgba(255,255,255,0.65)', fontSize: 28, fontWeight: 700}}>{p.n}</div>
                <div style={{flex: 1, height: 110, position: 'relative', background: 'rgba(255,255,255,0.04)', borderRadius: 14}}>
                  {p.clips.map(([a, b], j) => {
                    const v = t01(f, 8 + i * 4 + j * 3, 12);
                    return <div key={j} style={{position: 'absolute', left: `${a * 100}%`, width: `${(b - a) * 100 * v}%`, top: 8, bottom: 8, borderRadius: 12, background: p.c, boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.12)'}} />;
                  })}
                </div>
              </div>
            ))}
            <div style={{position: 'absolute', top: -20, bottom: 0, left: `calc(230px + ${cabeza} * (100% - 230px))`, width: 4, background: K.blanco}}>
              <div style={{position: 'absolute', top: -14, left: -14, width: 32, height: 32, borderRadius: 8, background: K.blanco, transform: 'rotate(45deg)'}} />
            </div>
          </div>
        </AbsoluteFill>
      </div>
    </AbsoluteFill>
  );
};

/* 11 · Paper Cutout — persona recortada tipo sticker sobre fondo de color con figuras geométricas */
export const PaperCutout: React.FC = () => {
  const f = useCurrentFrame();
  const corte = t01(f, 6, 16);
  const pega = t01(f, 14, 18, (x) => 1 - Math.pow(1 - x, 3));
  const figuras = Array.from({length: 12}, (_, i) => ({
    x: random(`pcx${i}`) * 1080,
    y: random(`pcy${i}`) * 1920,
    s: 60 + random(`pcs${i}`) * 140,
    tipo: i % 4,
    rot: random(`pcr${i}`) * 360,
  }));
  return (
    <AbsoluteFill>
      <Plano />
      <AbsoluteFill style={{background: K.morado, clipPath: `circle(${corte * 150}% at 50% 60%)`}}>
        {figuras.map((g, i) => {
          const t = t01(f, 10 + i * 2, 16);
          const st: React.CSSProperties = {position: 'absolute', left: g.x - g.s / 2, top: g.y - g.s / 2, width: g.s, height: g.s, transform: `rotate(${g.rot + f * (i % 2 ? 1.5 : -1.5)}deg) scale(${t})`};
          if (g.tipo === 0) return <div key={i} style={{...st, borderRadius: '50%', background: K.blanco, opacity: 0.9}} />;
          if (g.tipo === 1) return <div key={i} style={{...st, border: `14px solid ${K.tinta}`, borderRadius: 18, boxSizing: 'border-box'}} />;
          if (g.tipo === 2)
            return (
              <svg key={i} viewBox="0 0 100 100" style={st}>
                <polygon points="50,6 96,92 4,92" fill={K.niebla} />
              </svg>
            );
          return (
            <svg key={i} viewBox="0 0 100 40" style={{...st, height: g.s * 0.4}}>
              <path d="M2 20 Q14 2 26 20 T50 20 T74 20 T98 20" stroke={K.blanco} strokeWidth={8} fill="none" strokeLinecap="round" />
            </svg>
          );
        })}
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 190, top: 1000, transform: `translateY(${(1 - pega) * 200}px) rotate(${(1 - pega) * -12 + Math.sin(f / 12) * 2}deg) scale(${0.9 + 0.1 * pega})`, transformOrigin: '50% 100%', opacity: corte}}>
        <Silueta w={700} sticker />
      </div>
    </AbsoluteFill>
  );
};

/* 12 · Dolly Zoom — la persona se queda igual mientras el fondo se acerca (vértigo) */
export const DollyZoom: React.FC = () => {
  const f = useCurrentFrame();
  const z = interpolate(f, [8, 84], [1, 2.1], {...CL, easing: EXPO_IO});
  const lineas = Array.from({length: 14}, (_, i) => i);
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: K.niebla}}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `540px ${CARA.y - 250}px`}}>
        <Escena />
        {/* líneas de fuga para que se lea la profundidad */}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          {lineas.map((i) => {
            const a = (i / lineas.length) * Math.PI * 2;
            return <line key={i} x1={540} y1={CARA.y - 250} x2={540 + Math.cos(a) * 1800} y2={CARA.y - 250 + Math.sin(a) * 1800} stroke={K.morado} strokeWidth={2} opacity={0.18} />;
          })}
          {[200, 380, 600, 860].map((r) => (
            <rect key={r} x={540 - r} y={CARA.y - 250 - r * 1.4} width={r * 2} height={r * 2.8} fill="none" stroke={K.tinta} strokeOpacity={0.08} strokeWidth={3} rx={20} />
          ))}
        </svg>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 140, top: 920}}>
        <Silueta habla={false} />
      </div>
    </AbsoluteFill>
  );
};

/* 13 · Magazine Cover — portada de revista con el título detrás de la cabeza */
export const MagazineCover: React.FC = () => {
  const f = useCurrentFrame();
  const tit = t01(f, 6, 20);
  const sello = t01(f, 34, 14, (x) => 1 - Math.pow(1 - x, 3));
  const lineas = ['Cómo editar en minutos', 'El poder del motion', '20 efectos que funcionan'];
  return (
    <AbsoluteFill style={{background: K.niebla, overflow: 'hidden'}}>
      <Escena />
      {/* título detrás de la persona */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 640, textAlign: 'center', fontFamily: FONT, fontWeight: 800, fontSize: 300, letterSpacing: '-0.05em', color: K.morado, lineHeight: 1, transform: `translateY(${(1 - tit) * -80}px)`, opacity: tit}}>
        MOTION
      </div>
      <div style={{position: 'absolute', left: -10, top: 640}}>
        <Silueta w={1100} />
      </div>
      <div style={{position: 'absolute', left: 60, top: 200, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: K.tinta, opacity: t01(f, 14, 10), letterSpacing: '0.1em'}}>NOVIEMBRE 2026 · EDICIÓN 20</div>
      {lineas.map((l, i) => (
        <div key={l} style={{position: 'absolute', left: 60, top: 270 + i * 110, width: 520, fontFamily: FONT, fontWeight: 800, fontSize: 44, lineHeight: 1.05, color: i === 1 ? K.morado : K.tinta, opacity: t01(f, 18 + i * 5, 10), transform: `translateX(${(1 - t01(f, 18 + i * 5, 14)) * -40}px)`}}>
          {l}
        </div>
      ))}
      {/* código de barras */}
      <div style={{position: 'absolute', right: 60, bottom: 90, width: 230, height: 140, background: K.blanco, padding: 14, display: 'flex', gap: 4, alignItems: 'stretch', opacity: t01(f, 26, 10)}}>
        {Array.from({length: 28}).map((_, i) => (
          <div key={i} style={{width: random(`bc${i}`) > 0.5 ? 6 : 3, background: K.tinta}} />
        ))}
      </div>
      {/* sello */}
      <div style={{position: 'absolute', right: 70, top: 220, width: 230, height: 230, borderRadius: '50%', background: K.morado, color: K.blanco, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, transform: `scale(${sello}) rotate(${-14 + f * 0.4}deg)`, boxShadow: '0 20px 40px rgba(137,29,255,0.4)'}}>
        <div style={{fontSize: 96, lineHeight: 0.9}}>20</div>
        <div style={{fontSize: 36}}>efectos</div>
      </div>
    </AbsoluteFill>
  );
};

/* 14 · Liquid Glass — lente de vidrio que distorsiona y refracta la imagen */
export const LiquidGlass: React.FC = () => {
  const f = useCurrentFrame();
  const R = 250;
  const cx = interpolate(f, [0, 90], [260, 820], {...CL, easing: EXPO_IO});
  const cy = CARA.y - 160 + Math.sin(f / 14) * 120;
  const ap = t01(f, 2, 14);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <svg width={0} height={0} style={{position: 'absolute'}}>
        <filter id="lgD">
          <feTurbulence type="fractalNoise" baseFrequency="0.008" numOctaves={2} seed={Math.floor(f / 3)} />
          <feDisplacementMap in="SourceGraphic" scale={40} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <Plano />
      <div style={{position: 'absolute', left: cx - R, top: cy - R, width: R * 2, height: R * 2, borderRadius: '50%', overflow: 'hidden', transform: `scale(${ap})`, boxShadow: '0 30px 60px rgba(33,33,53,0.35), inset 0 0 0 2px rgba(255,255,255,0.7)'}}>
        {/* imagen refractada: aumentada, desplazada y deformada */}
        <div style={{position: 'absolute', left: R - cx, top: R - cy, width: 1080, height: 1920, transform: 'scale(1.45)', transformOrigin: `${cx}px ${cy}px`, filter: 'url(#lgD) saturate(1.2)'}}>
          <Plano />
        </div>
        {/* aberración cromática del borde */}
        <div style={{position: 'absolute', inset: 0, borderRadius: '50%', boxShadow: `inset 8px 0 20px rgba(137,29,255,0.45), inset -8px 0 20px rgba(255,255,255,0.6), inset 0 -30px 50px rgba(33,33,53,0.2)`}} />
        {/* brillo especular */}
        <div style={{position: 'absolute', left: R * 0.35, top: R * 0.18, width: R * 0.9, height: R * 0.45, borderRadius: '50%', background: 'linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,255,255,0))', transform: 'rotate(-20deg)'}} />
      </div>
    </AbsoluteFill>
  );
};
