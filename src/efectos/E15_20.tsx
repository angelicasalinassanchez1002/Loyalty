import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {CARA, CL, EXPO, EXPO_IO, Escena, FONT, IC, Ico, K, Plano, Silueta, ease, t01} from './base';

/* 15 · Zoom Through Cut — zoom extremo hacia la cámara que pasa al siguiente plano */
export const ZoomThroughCut: React.FC = () => {
  const f = useCurrentFrame();
  const corte = 40;
  const a = interpolate(f, [20, corte], [1, 14], {...CL, easing: (x) => x * x * x});
  const b = interpolate(f, [corte, corte + 16], [0.35, 1], {...CL, easing: EXPO});
  const blurA = Math.min(30, (a - 1) * 3);
  const blurB = (1 - t01(f, corte, 14)) * 24;
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: K.blanco}}>
      {f < corte ? (
        <AbsoluteFill style={{transform: `scale(${a})`, transformOrigin: `${CARA.x}px ${CARA.y - 70}px`, filter: `blur(${blurA}px)`}}>
          <Plano />
        </AbsoluteFill>
      ) : (
        <AbsoluteFill style={{transform: `scale(${b})`, filter: `blur(${blurB}px)`}}>
          <Plano oscura semilla="b2" />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{background: K.blanco, opacity: Math.max(0, 1 - Math.abs(f - corte) / 3) * 0.8}} />
    </AbsoluteFill>
  );
};

/* 16 · Green Screen — el fondo pasa a verde y luego a una ciudad al atardecer */
export const GreenScreen: React.FC = () => {
  const f = useCurrentFrame();
  const verde = t01(f, 10, 6);
  const ciudad = t01(f, 40, 20, EXPO_IO);
  const edificios = Array.from({length: 16}, (_, i) => ({x: i * 72 - 20, w: 60 + random(`gw${i}`) * 50, h: 240 + random(`gh${i}`) * 560}));
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Escena />
      <AbsoluteFill style={{background: '#00B140', opacity: verde}} />
      <AbsoluteFill style={{clipPath: `inset(0 ${(1 - ciudad) * 100}% 0 0)`}}>
        <AbsoluteFill style={{background: `linear-gradient(180deg, ${K.tinta} 0%, #4A1A8C 45%, ${K.morado} 72%, #D7B8FF 100%)`}} />
        <div style={{position: 'absolute', left: 540 - 220, top: 1080, width: 440, height: 440, borderRadius: '50%', background: 'radial-gradient(circle, #FFFFFF 0%, #F0E2FF 40%, rgba(240,226,255,0) 70%)'}} />
        {edificios.map((e, i) => (
          <div key={i} style={{position: 'absolute', left: e.x, bottom: 0, width: e.w, height: e.h + 200, background: i % 2 ? K.tinta : '#2B2B45', transform: `translateY(${(1 - ciudad) * 200}px)`}}>
            {Array.from({length: Math.floor(e.h / 70)}).map((_, j) => (
              <div key={j} style={{position: 'absolute', left: 12, top: 30 + j * 70, width: e.w - 24, height: 14, background: random(`v${i}${j}`) > 0.55 ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.08)'}} />
            ))}
          </div>
        ))}
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 140, top: 920, filter: `drop-shadow(0 0 ${verde * (1 - ciudad) * 14}px rgba(0,177,64,0.7))`}}>
        <Silueta />
      </div>
    </AbsoluteFill>
  );
};

/* 17 · Frame Break — la pantalla se estrella como vidrio y los pedazos caen */
const IMPACTO = {x: 600, y: 1150};
const RAYOS = 11;
const ANILLOS = [0, 230, 560, 2400];
const fragmentos = (() => {
  const angs = Array.from({length: RAYOS}, (_, i) => (i / RAYOS) * Math.PI * 2 + (random(`ra${i}`) - 0.5) * 0.35);
  const out: {pts: [number, number][]; c: [number, number]; k: number}[] = [];
  for (let r = 0; r < ANILLOS.length - 1; r++) {
    for (let i = 0; i < RAYOS; i++) {
      const a1 = angs[i];
      const a2 = angs[(i + 1) % RAYOS] + (i === RAYOS - 1 ? Math.PI * 2 : 0);
      const r1 = ANILLOS[r] * (0.85 + random(`r1${r}${i}`) * 0.3);
      const r2 = ANILLOS[r + 1] * (0.85 + random(`r2${r}${i}`) * 0.3);
      const P = (a: number, rr: number): [number, number] => [IMPACTO.x + Math.cos(a) * rr, IMPACTO.y + Math.sin(a) * rr];
      const pts: [number, number][] = r === 0 ? [P(a1, 0), P(a1, r2), P(a2, r2)] : [P(a1, r1), P(a1, r2), P(a2, r2), P(a2, r1)];
      const c: [number, number] = [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
      out.push({pts, c, k: r * RAYOS + i});
    }
  }
  return out;
})();
export const FrameBreak: React.FC = () => {
  const f = useCurrentFrame();
  const grieta = t01(f, 22, 6);
  const cae = 36;
  return (
    <AbsoluteFill style={{background: K.tinta, overflow: 'hidden'}}>
      <AbsoluteFill style={{opacity: t01(f, cae, 20)}}>
        <Plano oscura semilla="fb" />
      </AbsoluteFill>
      {fragmentos.map((fr) => {
        const dt = Math.max(0, f - cae - random(`d${fr.k}`) * 10);
        const vx = (fr.c[0] - IMPACTO.x) * 0.012 + (random(`vx${fr.k}`) - 0.5) * 4;
        const dx = vx * dt;
        const dy = 0.9 * dt * dt + (fr.c[1] - IMPACTO.y) * 0.004 * dt;
        const rot = (random(`rt${fr.k}`) - 0.5) * 2.4 * dt;
        const poly = fr.pts.map((p) => `${p[0]}px ${p[1]}px`).join(',');
        return (
          <div key={fr.k} style={{position: 'absolute', inset: 0, transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, transformOrigin: `${fr.c[0]}px ${fr.c[1]}px`}}>
            <AbsoluteFill style={{clipPath: `polygon(${poly})`}}>
              <Plano />
              <AbsoluteFill style={{background: `linear-gradient(${random(`g${fr.k}`) * 360}deg, rgba(255,255,255,0.18), rgba(255,255,255,0))`, opacity: grieta}} />
            </AbsoluteFill>
          </div>
        );
      })}
      {/* grietas */}
      {f < cae + 4 && (
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: grieta}}>
          {fragmentos.map((fr) => (
            <polygon key={fr.k} points={fr.pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={K.blanco} strokeWidth={3} strokeOpacity={0.9} />
          ))}
          <circle cx={IMPACTO.x} cy={IMPACTO.y} r={26} fill={K.blanco} opacity={0.8} />
        </svg>
      )}
      <AbsoluteFill style={{background: K.blanco, opacity: f >= 22 && f <= 24 ? 0.5 : 0}} />
    </AbsoluteFill>
  );
};

/* 18 · Digital Zoom — interfaz de cámara con REC, 2.6×, contador y esquinas de enfoque */
export const DigitalZoom: React.FC = () => {
  const f = useCurrentFrame();
  const z = interpolate(f, [14, 70], [1, 2.6], {...CL, easing: EXPO_IO});
  const foco = t01(f, 8, 16);
  const seg = Math.floor((f + 248) / 30);
  const cuadro = (f + 248) % 30;
  const tc = `00:00:${String(seg).padStart(2, '0')}:${String(cuadro).padStart(2, '0')}`;
  const caja = 520 - 180 * foco;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${z})`, transformOrigin: `${CARA.x}px ${CARA.y - 70}px`}}>
        <Plano />
      </AbsoluteFill>
      {/* rejilla de tercios */}
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(90deg, transparent 33.2%, rgba(255,255,255,0.35) 33.3%, transparent 33.5%, transparent 66.5%, rgba(255,255,255,0.35) 66.6%, transparent 66.8%), linear-gradient(transparent 33.2%, rgba(255,255,255,0.35) 33.3%, transparent 33.5%, transparent 66.5%, rgba(255,255,255,0.35) 66.6%, transparent 66.8%)'}} />
      {/* esquinas de enfoque */}
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => (
        <div key={i} style={{position: 'absolute', left: 540 + sx * caja / 2 - (sx > 0 ? 70 : 0), top: 960 + sy * caja / 2 - (sy > 0 ? 70 : 0), width: 70, height: 70, borderLeft: sx < 0 ? `6px solid ${K.blanco}` : undefined, borderRight: sx > 0 ? `6px solid ${K.blanco}` : undefined, borderTop: sy < 0 ? `6px solid ${K.blanco}` : undefined, borderBottom: sy > 0 ? `6px solid ${K.blanco}` : undefined, opacity: 0.4 + 0.6 * foco}} />
      ))}
      <div style={{position: 'absolute', left: 60, top: 200, display: 'flex', alignItems: 'center', gap: 16, fontFamily: FONT, fontWeight: 800, fontSize: 48, color: K.blanco, background: 'rgba(33,33,53,0.6)', backdropFilter: 'blur(10px)', padding: '10px 26px', borderRadius: 999}}>
        <div style={{width: 30, height: 30, borderRadius: 15, background: K.morado, opacity: Math.floor(f / 12) % 2 ? 0.3 : 1, boxShadow: `0 0 20px ${K.morado}`}} />
        REC
      </div>
      <div style={{position: 'absolute', right: 60, top: 200, fontFamily: FONT, fontWeight: 700, fontSize: 44, color: K.blanco, background: 'rgba(33,33,53,0.6)', backdropFilter: 'blur(10px)', padding: '12px 26px', borderRadius: 999, fontVariantNumeric: 'tabular-nums'}}>{tc}</div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 200, display: 'flex', justifyContent: 'center'}}>
        <div style={{background: 'rgba(33,33,53,0.55)', backdropFilter: 'blur(10px)', borderRadius: 999, padding: '14px 34px', fontFamily: FONT, fontWeight: 800, fontSize: 56, color: K.blanco, fontVariantNumeric: 'tabular-nums'}}>{z.toFixed(1)}×</div>
      </div>
      <div style={{position: 'absolute', left: 60, bottom: 120, fontFamily: FONT, fontWeight: 700, fontSize: 34, color: K.blanco, background: 'rgba(33,33,53,0.6)', padding: '8px 20px', borderRadius: 999}}>4K · 30 fps</div>
    </AbsoluteFill>
  );
};

/* 19 · Phone Mockup — el video se mete dentro de un celular como Reel */
export const PhoneMockup: React.FC = () => {
  const f = useCurrentFrame();
  const p = interpolate(f, [6, 34], [0, 1], {...CL, easing: EXPO_IO});
  const s = 1 - 0.38 * p;
  const W = 1080 * s;
  const H = 1920 * s;
  const x = 540 - W / 2;
  const y = 960 - H / 2;
  const ui = t01(f, 30, 14);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${K.niebla}, #D9DAE8)`}}>
      <div style={{position: 'absolute', left: 140, top: 300, width: 800, height: 1300, borderRadius: '50%', background: K.morado, opacity: 0.25 * p, filter: 'blur(140px)'}} />
      {/* cuerpo del celular */}
      <div style={{position: 'absolute', left: x - 26 * p, top: y - 26 * p, width: W + 52 * p, height: H + 52 * p, borderRadius: 40 + 70 * p, background: K.tinta, opacity: p, boxShadow: '0 60px 120px rgba(33,33,53,0.4)', transform: `rotate(${-4 * p + Math.sin(f / 20) * 0.6 * p}deg)`}} />
      <div style={{position: 'absolute', left: x, top: y, width: W, height: H, borderRadius: 60 * p, overflow: 'hidden', transform: `rotate(${-4 * p + Math.sin(f / 20) * 0.6 * p}deg)`}}>
        <div style={{width: 1080, height: 1920, transform: `scale(${s})`, transformOrigin: '0 0'}}>
          <Plano />
          {/* interfaz tipo Reel */}
          <AbsoluteFill style={{opacity: ui, fontFamily: FONT}}>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 700, background: 'linear-gradient(180deg, rgba(33,33,53,0), rgba(33,33,53,0.7))'}} />
            <div style={{position: 'absolute', left: 60, top: 120, color: K.blanco, fontSize: 54, fontWeight: 800}}>Reels</div>
            <div style={{position: 'absolute', right: 50, bottom: 360, display: 'flex', flexDirection: 'column', gap: 50, alignItems: 'center'}}>
              {[IC.corazon, IC.globo, IC.enviar].map((d, i) => (
                <div key={i} style={{transform: `scale(${t01(f, 34 + i * 4, 10)})`, textAlign: 'center'}}>
                  <Ico d={d} size={96} />
                  <div style={{color: K.blanco, fontSize: 34, fontWeight: 700}}>{['12.4k', '318', 'Enviar'][i]}</div>
                </div>
              ))}
            </div>
            <div style={{position: 'absolute', left: 60, bottom: 230, color: K.blanco, fontSize: 46, fontWeight: 800}}>@tu.negocio</div>
            <div style={{position: 'absolute', left: 60, bottom: 160, color: K.blanco, fontSize: 38, fontWeight: 600, opacity: 0.9}}>20 efectos hechos con código</div>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 60, height: 8, background: 'rgba(255,255,255,0.3)'}}>
              <div style={{width: `${t01(f, 30, 60, (q) => q) * 100}%`, height: '100%', background: K.blanco}} />
            </div>
          </AbsoluteFill>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 20 · Checklist — cierre: checklist que se marca y los 20 nombres a los lados */
export const NOMBRES = [
  'Orbit', 'Chat Takeover', 'Frame Escape', 'Snap Zoom', 'Checklist Pop', 'Headline Storm', 'Zoom Portal', 'Growth Curve', 'Studio Reveal', 'B-roll Overlay',
  'Paper Cutout', 'Dolly Zoom', 'Magazine Cover', 'Liquid Glass', 'Zoom Through Cut', 'Green Screen', 'Frame Break', 'Digital Zoom', 'Phone Mockup', 'Checklist',
];
export const ChecklistCierre: React.FC = () => {
  const f = useCurrentFrame();
  const cuenta = Math.min(20, Math.floor(interpolate(f, [8, 64], [0, 20], CL)));
  const lista = t01(f, 64, 20, EXPO_IO);
  return (
    <AbsoluteFill style={{background: K.tinta, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 140, top: 560, width: 800, height: 800, borderRadius: '50%', background: K.morado, opacity: 0.3, filter: 'blur(160px)'}} />
      {/* nombres a los lados */}
      {NOMBRES.map((n, i) => {
        const izq = i < 10;
        const fila = i % 10;
        const t = t01(f, 64 + fila * 2 + (izq ? 0 : 1), 16);
        const hecho = i < cuenta;
        return (
          <div key={n} style={{position: 'absolute', [izq ? 'left' : 'right']: 50, top: 230 + fila * 150, display: 'flex', alignItems: 'center', gap: 12, flexDirection: izq ? 'row' : 'row-reverse', fontFamily: FONT, fontWeight: 700, fontSize: 34, color: hecho ? K.blanco : 'rgba(255,255,255,0.4)', opacity: t, transform: `translateX(${(1 - t) * (izq ? -60 : 60)}px)`}}>
            <div style={{width: 34, height: 34, borderRadius: 10, background: hecho ? K.morado : 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              {hecho && <Ico d={IC.check} size={24} w={3} />}
            </div>
            {n}
          </div>
        );
      })}
      {/* checklist central que se va marcando y luego se encoge */}
      <div style={{position: 'absolute', left: 540, top: 960, transform: `translate(-50%, -50%) scale(${1 - 0.25 * lista})`, fontFamily: FONT, textAlign: 'center'}}>
        <div style={{position: 'relative', height: 420, width: 640, overflow: 'hidden', opacity: 1 - lista, marginBottom: 40 * (1 - lista)}}>
          {NOMBRES.map((n, i) => {
            const y = (i - cuenta) * 90 + 210;
            const hecho = i < cuenta;
            return (
              <div key={n} style={{position: 'absolute', left: 60, top: y, display: 'flex', alignItems: 'center', gap: 20, fontSize: 52, fontWeight: 800, color: hecho ? K.blanco : 'rgba(255,255,255,0.35)', opacity: Math.max(0, 1 - Math.abs(y - 210) / 260)}}>
                <div style={{width: 58, height: 58, borderRadius: 16, background: hecho ? K.morado : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{hecho && <Ico d={IC.check} size={40} w={3} />}</div>
                {n}
              </div>
            );
          })}
        </div>
        <div style={{fontSize: 150, fontWeight: 800, color: K.blanco, lineHeight: 1, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums'}}>
          {Math.min(19, cuenta)} <span style={{color: 'rgba(255,255,255,0.4)'}}>/ 20</span>
        </div>
        <div style={{fontSize: 56, fontWeight: 700, color: K.blanco, marginTop: 10}}>efectos.</div>
        <div style={{fontSize: 56, fontWeight: 800, color: K.morado, opacity: t01(f, 56, 12)}}>Todo hecho con Claude.</div>
      </div>
    </AbsoluteFill>
  );
};
