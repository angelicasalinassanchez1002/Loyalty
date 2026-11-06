import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import '@fontsource/gantari/500.css';
import '@fontsource/gantari/600.css';
import '@fontsource/gantari/700.css';
import '@fontsource/gantari/800.css';
import {VOZ, enEscena, idx} from './tiempos';

export const K = {
  morado: '#891DFF',
  tinta: '#212135',
  niebla: '#E9EAF2',
  blanco: '#FFFFFF',
  // Solo la paleta canónica (#891DFF, #212135, #E9EAF2, #FFFFFF) y sus transparencias.
  suave: 'rgba(33,33,53,0.55)',
  tenue: 'rgba(33,33,53,0.22)',
};
export const FONT = "'Gantari', sans-serif";
export const EXPO = Easing.bezier(0.16, 1, 0.3, 1);
export const EXPO_IO = Easing.bezier(0.87, 0, 0.13, 1);

const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const t01 = (f: number, a: number, d: number, e = EXPO) => interpolate(f, [a, a + d], [0, 1], {...CL, easing: e});

/** Interpolación por llaves [[cuadro, valor], …] con EXPO_IO entre cada par. */
export const keys = (f: number, ks: [number, number][], e = EXPO_IO) => {
  if (f <= ks[0][0]) return ks[0][1];
  for (let i = 0; i < ks.length - 1; i++) {
    const [a, va] = ks[i];
    const [b, vb] = ks[i + 1];
    if (f <= b) return va + (vb - va) * e((f - a) / Math.max(1, b - a));
  }
  return ks[ks.length - 1][1];
};

/* ---------- Palabra: sube desde una máscara en el cuadro en que se dice ---------- */
export const Palabra: React.FC<{
  w: string;
  en: number;
  acento?: boolean;
  resalte?: boolean;
  sale?: number;
  color?: string;
  colorAcento?: string;
  late?: boolean;
}> = ({w, en, acento, resalte = true, sale, color, colorAcento = K.morado, late}) => {
  const f = useCurrentFrame();
  const a = en - 3;
  const t = t01(f, a, 12);
  const s = sale === undefined ? 0 : t01(f, sale, 12, Easing.bezier(0.7, 0, 0.84, 0));
  const r = acento && resalte ? t01(f, a + 4, 14) : 0;
  const pulso = late ? 1 + 0.08 * Math.sin(Math.min(1, Math.max(0, (f - a) / 14)) * Math.PI) : 1;
  return (
    <span style={{display: 'inline-block', position: 'relative', overflow: 'hidden', verticalAlign: 'bottom', padding: '0.06em 0.04em 0.12em', margin: '-0.06em -0.04em -0.12em'}}>
      {r > 0 && (
        <span
          style={{
            position: 'absolute',
            left: '-0.04em',
            right: '-0.04em',
            top: '0.28em',
            bottom: '0.08em',
            background: 'rgba(137,29,255,0.16)',
            borderRadius: '0.12em',
            transformOrigin: 'left center',
            transform: `scaleX(${r})`,
          }}
        />
      )}
      <span
        style={{
          display: 'inline-block',
          position: 'relative',
          transform: `translateY(${(1 - t) * 110 - s * 110}%) scale(${pulso})`,
          color: acento ? colorAcento : color,
          fontWeight: acento ? 800 : undefined,
        }}
      >
        {w}
      </span>
    </span>
  );
};

/** Frase del guion (escena k) que empieza con `desde` y tiene `n` palabras. Acentos por texto normalizado. */
export const Frase: React.FC<{
  k: number;
  desde: string;
  n: number;
  acentos?: string[];
  resalte?: boolean;
  sale?: number;
  color?: string;
  colorAcento?: string;
  saltos?: number[]; // índices locales donde se parte la línea
  style?: React.CSSProperties;
  late?: boolean;
}> = ({k, desde, n, acentos = [], resalte = true, sale, color, colorAcento, saltos = [], style, late}) => {
  const i0 = idx(k, desde);
  const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  const acc = new Set(acentos.map(norm));
  const out: React.ReactNode[] = [];
  for (let j = 0; j < n; j++) {
    const v = VOZ[i0 + j];
    if (saltos.includes(j)) out.push(<br key={`br${j}`} />);
    out.push(
      <Palabra
        key={j}
        w={v.t}
        en={enEscena(k, i0 + j)}
        acento={acc.has(norm(v.t))}
        resalte={resalte}
        sale={sale}
        color={color}
        colorAcento={colorAcento}
        late={late && acc.has(norm(v.t))}
      />,
    );
    if (j < n - 1 && !saltos.includes(j + 1)) out.push(<span key={`s${j}`}> </span>);
  }
  return <div style={{fontFamily: FONT, ...style}}>{out}</div>;
};

/* ---------- Íconos de trazo 24×24 ---------- */
export const Ico: React.FC<{d: string | string[]; size?: number; color?: string; w?: number; style?: React.CSSProperties}> = ({d, size = 48, color = K.morado, w = 2, style}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {(Array.isArray(d) ? d : [d]).map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);
export const I = {
  persona: ['M12 12a4 4 0 100-8 4 4 0 000 8z', 'M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7'],
  check: 'M5 12.5l4.5 4.5L19 7.5',
  buscar: ['M11 18a7 7 0 100-14 7 7 0 000 14z', 'M20 20l-4-4'],
  mega: ['M3 10v4h3l7 4V6L6 10H3z', 'M17 9a4 4 0 010 6'],
  ticket: ['M6 3h12v18l-3-2-3 2-3-2-3 2V3z', 'M9 8h6M9 12h6'],
  tienda: ['M3 9l1.5-5h15L21 9', 'M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0', 'M5 12v8h14v-8', 'M10 20v-5h4v5'],
  enviar: ['M4 12l16-8-6 16-3-7-7-1z'],
  bolsa: ['M5 8h14l-1 12H6L5 8z', 'M9 8a3 3 0 016 0'],
};

export const sombra = '0 24px 50px rgba(33,33,53,0.14)';
export const sombraFuerte = '0 34px 80px rgba(0,0,0,0.35)';

/* ---------- Cámara: centra el punto (cx, cy) del mundo con escala s ---------- */
export const Camara: React.FC<{cx: number; cy: number; s: number; children: React.ReactNode}> = ({cx, cy, s, children}) => (
  <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transformOrigin: '0 0', transform: `translate(${540 - cx * s}px, ${960 - cy * s}px) scale(${s})`}}>
    {children}
  </div>
);

export const Abs: React.FC<{x: number; y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({x, y, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, ...style}}>{children}</div>
);

/** Aparece con escala desde un punto (pop sobrio). */
export const Pop: React.FC<{en: number; children: React.ReactNode; desde?: number; style?: React.CSSProperties}> = ({en, children, desde = 0.6, style}) => {
  const f = useCurrentFrame();
  const t = t01(f, en, 16);
  return <div style={{transform: `scale(${desde + (1 - desde) * t})`, opacity: Math.min(1, t * 2), ...style}}>{children}</div>;
};

/* ---------- Fondos sutiles, uno por escena ---------- */
export const FondoPuntos: React.FC<{bg?: string; color?: string; paso?: number}> = ({bg = K.blanco, color = K.niebla, paso = 54}) => (
  <div style={{position: 'absolute', inset: 0, background: bg, backgroundImage: `radial-gradient(${color} 3px, transparent 3.5px)`, backgroundSize: `${paso}px ${paso}px`}} />
);
export const FondoDiagonales: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: K.blanco, backgroundImage: `repeating-linear-gradient(135deg, ${K.niebla} 0 2px, transparent 2px 46px)`}} />
);
export const FondoCuadricula: React.FC<{bg?: string; color?: string}> = ({bg = K.tinta, color = 'rgba(255,255,255,0.05)'}) => (
  <div style={{position: 'absolute', inset: 0, background: bg, backgroundImage: `linear-gradient(${color} 2px, transparent 2px), linear-gradient(90deg, ${color} 2px, transparent 2px)`, backgroundSize: '90px 90px', backgroundPosition: '0 0'}} />
);
export const FondoAnillos: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: K.niebla, backgroundImage: `repeating-radial-gradient(circle at 50% 52%, transparent 0 88px, rgba(255,255,255,0.75) 88px 91px)`}} />
);
