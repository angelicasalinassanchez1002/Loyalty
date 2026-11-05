import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, EASE, EASE_IN, FONT} from './tema';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const prog = (f: number, a: number, dur: number, ease = EASE) =>
  interpolate(f, [a, a + dur], [0, 1], {...clamp, easing: ease});

/* ---------- Texto: desenfoque + letras que se juntan; salida con desenfoque ---------- */
export type Seg = {t: string; color?: string};
export type Linea = Seg[] | string;

export const TextoEntra: React.FC<{
  lineas: Linea[];
  en: number; // frame de entrada
  sale?: number; // frame de salida
  size?: number;
  color?: string;
  alinear?: 'center' | 'left';
  peso?: number;
  pasoPalabra?: number;
  porLetra?: boolean; // anima letra por letra (paso = pasoPalabra)
  lineHeight?: number;
  style?: React.CSSProperties;
}> = ({lineas, en, sale, size = 84, color = C.tinta, alinear = 'center', peso = 800, pasoPalabra = 4, porLetra = false, lineHeight = 1.08, style}) => {
  const f = useCurrentFrame();
  let k = 0;
  const salida = sale === undefined ? 0 : prog(f, sale, 8, EASE_IN);
  return (
    <div
      style={{
        fontFamily: FONT,
        fontWeight: peso,
        fontSize: size,
        lineHeight,
        letterSpacing: '-0.01em',
        textAlign: alinear,
        color,
        opacity: 1 - salida,
        filter: `blur(${salida * 10}px)`,
        ...style,
      }}
    >
      {lineas.map((l, i) => {
        const segs: Seg[] = typeof l === 'string' ? [{t: l}] : l;
        const palabras: {w: string; color?: string}[] = [];
        segs.forEach((sg) => sg.t.split(' ').filter(Boolean).forEach((w) => palabras.push({w, color: sg.color})));
        if (porLetra) {
          return (
            <div key={i} style={{whiteSpace: 'nowrap'}}>
              {palabras.map((p, j) => (
                <span key={j} style={{display: 'inline-block', marginRight: j < palabras.length - 1 ? '0.26em' : 0}}>
                  {Array.from(p.w).map((ch, m) => {
                    const a = en + k++ * pasoPalabra;
                    const t = prog(f, a, 18);
                    return (
                      <span
                        key={m}
                        style={{
                          display: 'inline-block',
                          opacity: t,
                          filter: `blur(${(1 - t) * 14}px)`,
                          transform: `translateY(${(1 - t) * 18}px)`,
                          marginRight: `${(1 - t) * 0.35}em`,
                          color: p.color ?? color,
                        }}
                      >
                        {ch}
                      </span>
                    );
                  })}
                </span>
              ))}
            </div>
          );
        }
        return (
          <div key={i} style={{whiteSpace: 'nowrap'}}>
            {palabras.map((p, j) => {
              const a = en + k++ * pasoPalabra;
              const t = prog(f, a, 16);
              return (
                <span
                  key={j}
                  style={{
                    display: 'inline-block',
                    opacity: t,
                    filter: `blur(${(1 - t) * 12}px)`,
                    letterSpacing: `${(1 - t) * 0.4 - 0.01}em`,
                    color: p.color ?? color,
                    marginRight: j < palabras.length - 1 ? '0.26em' : 0,
                  }}
                >
                  {p.w}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Pieza: aparece (0.92→1 + blur + opacidad) y sale (→0.96 + blur) ---------- */
export const Pieza: React.FC<{
  en: number;
  sale?: number;
  dy?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({en, sale, dy = 30, children, style}) => {
  const f = useCurrentFrame();
  const t = prog(f, en, 18);
  const o = sale === undefined ? 0 : prog(f, sale, 9, EASE_IN);
  const esc = 0.92 + 0.08 * t - 0.04 * o;
  return (
    <div
      style={{
        opacity: t * (1 - o),
        transform: `translateY(${(1 - t) * dy}px) scale(${esc})`,
        filter: `blur(${(1 - t) * 14 + o * 10}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ---------- Fondos ---------- */
export const FondoClaro: React.FC<{abajo?: string}> = ({abajo = '#D6D6D6'}) => (
  <AbsoluteFill style={{background: `linear-gradient(180deg, #FFFFFF 0%, ${abajo} 100%)`}} />
);

export const FondoBlanco: React.FC = () => <AbsoluteFill style={{background: C.blanco}} />;

export const FondoTinta: React.FC<{glow?: string; intensidad?: number}> = ({glow = C.glow, intensidad = 1}) => (
  <AbsoluteFill style={{background: C.tinta}}>
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 90% 45% at 50% 105%, ${glow} 0%, ${glow}00 70%)`,
        opacity: 0.75 * intensidad,
      }}
    />
  </AbsoluteFill>
);

/* ---------- Íconos de trazo ---------- */
type IcoProps = {size?: number; color?: string; stroke?: number};
const Svg: React.FC<IcoProps & {children: React.ReactNode}> = ({size = 48, color = C.morado, stroke = 2, children}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
export const IcoPersona: React.FC<IcoProps> = (p) => (
  <Svg {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
  </Svg>
);
export const IcoTienda: React.FC<IcoProps> = (p) => (
  <Svg {...p}>
    <path d="M3 9l1.5-5h15L21 9" />
    <path d="M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0" />
    <path d="M5 12v8h14v-8" />
    <path d="M10 20v-5h4v5" />
  </Svg>
);
export const IcoCheck: React.FC<IcoProps> = (p) => (
  <Svg {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Svg>
);
export const IcoMegafono: React.FC<IcoProps> = (p) => (
  <Svg {...p}>
    <path d="M3 10v4h3l7 4V6L6 10H3z" />
    <path d="M17 9a4 4 0 010 6" />
  </Svg>
);
export const IcoMensaje: React.FC<IcoProps> = (p) => (
  <Svg {...p}>
    <path d="M4 5h16v11H9l-5 4V5z" />
  </Svg>
);
export const IcoTicket: React.FC<IcoProps> = (p) => (
  <Svg {...p}>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" />
    <path d="M9 8h6M9 12h6" />
  </Svg>
);
export const IcoTel: React.FC<IcoProps> = (p) => (
  <Svg {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z" />
  </Svg>
);

export const Circulo: React.FC<{size?: number; bg?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({
  size = 96,
  bg = '#F1E6FF',
  children,
  style,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      ...style,
    }}
  >
    {children}
  </div>
);

export const sombra = '0 18px 40px rgba(0,0,0,0.14)';
