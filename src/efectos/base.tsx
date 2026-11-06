import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {EXPO, EXPO_IO, FONT, K, t01} from '../v2/kit';

export {EXPO, EXPO_IO, FONT, K, t01};
export const DUR = 90; // 3 s por efecto
export const CARA = {x: 540, y: 1250}; // centro de la cabeza de la silueta en el plano completo
export const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const lerp = (t: number, a: number, b: number) => a + (b - a) * t;
export const ease = (f: number, a: number, b: number, from: number, to: number, e = EXPO) => interpolate(f, [a, b], [from, to], {...CL, easing: e});

/** Silueta de busto que hace de «persona». `sticker` agrega borde blanco grueso tipo recorte. */
export const Silueta: React.FC<{w?: number; sticker?: boolean; habla?: boolean; color?: string; style?: React.CSSProperties}> = ({w = 800, sticker, habla = true, color, style}) => {
  const f = useCurrentFrame();
  const resp = habla ? 1 + 0.008 * Math.sin(f / 5) : 1;
  const ladeo = habla ? Math.sin(f / 23) * 1.5 : 0;
  const id = `sil${w}${sticker ? 's' : ''}`;
  return (
    <svg width={w} height={w * 1.25} viewBox="0 0 400 500" style={{overflow: 'visible', transform: `rotate(${ladeo}deg) scale(${resp})`, transformOrigin: '50% 100%', ...style}}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color ?? '#3A3A58'} />
          <stop offset="1" stopColor={color ?? K.tinta} />
        </linearGradient>
        <linearGradient id={`${id}r`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={K.morado} stopOpacity={0.9} />
          <stop offset="0.35" stopColor={K.morado} stopOpacity={0} />
        </linearGradient>
      </defs>
      <g stroke={sticker ? K.blanco : 'none'} strokeWidth={sticker ? 22 : 0} strokeLinejoin="round" style={{filter: sticker ? 'drop-shadow(0 18px 24px rgba(33,33,53,0.35))' : undefined}}>
        <path d="M30 500 C30 370 110 318 200 318 C290 318 370 370 370 500 Z" fill={`url(#${id}g)`} />
        <rect x="165" y="250" width="70" height="90" rx="20" fill={`url(#${id}g)`} />
        <ellipse cx="200" cy="170" rx="92" ry="108" fill={`url(#${id}g)`} />
      </g>
      {/* luz de contorno morada */}
      <ellipse cx="200" cy="170" rx="92" ry="108" fill={`url(#${id}r)`} opacity={0.6} />
      <path d="M30 500 C30 370 110 318 200 318 C290 318 370 370 370 500 Z" fill={`url(#${id}r)`} opacity={0.5} />
    </svg>
  );
};

/** Fondo del «video»: pared clara con luz morada y bokeh. */
export const Escena: React.FC<{oscura?: boolean; semilla?: string}> = ({oscura, semilla = 'esc'}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: oscura ? `linear-gradient(180deg, #2B2B45, ${K.tinta})` : `linear-gradient(180deg, ${K.blanco} 0%, ${K.niebla} 100%)`, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: -200, top: 200, width: 1100, height: 1100, borderRadius: '50%', background: K.morado, opacity: oscura ? 0.35 : 0.14, filter: 'blur(160px)'}} />
      {Array.from({length: 7}).map((_, i) => {
        const r = 30 + random(`${semilla}r${i}`) * 70;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: random(`${semilla}x${i}`) * 1080,
              top: 150 + random(`${semilla}y${i}`) * 900 + Math.sin((f + i * 20) / 30) * 10,
              width: r * 2,
              height: r * 2,
              borderRadius: '50%',
              background: i % 3 ? K.blanco : K.morado,
              opacity: oscura ? 0.12 : 0.35,
              filter: `blur(${r * 0.4}px)`,
            }}
          />
        );
      })}
      {/* repisa y lámpara para dar lectura de espacio */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 760, height: 10, background: oscura ? 'rgba(255,255,255,0.06)' : 'rgba(33,33,53,0.06)'}} />
      <div style={{position: 'absolute', left: 820, top: 0, width: 4, height: 360, background: oscura ? 'rgba(255,255,255,0.15)' : 'rgba(33,33,53,0.15)'}} />
      <div style={{position: 'absolute', left: 742, top: 350, width: 160, height: 90, borderRadius: '80px 80px 10px 10px', background: K.morado, boxShadow: `0 60px 120px 40px rgba(137,29,255,${oscura ? 0.45 : 0.25})`}} />
    </AbsoluteFill>
  );
};

/** El «plano» completo: escena + persona a cuadro. */
export const Plano: React.FC<{oscura?: boolean; semilla?: string; sinPersona?: boolean}> = ({oscura, semilla, sinPersona}) => (
  <AbsoluteFill>
    <Escena oscura={oscura} semilla={semilla} />
    {!sinPersona && (
      <div style={{position: 'absolute', left: 140, top: 920}}>
        <Silueta />
      </div>
    )}
  </AbsoluteFill>
);

/** Etiqueta del efecto (número y nombre). */
export const Etiqueta: React.FC<{n: number; nombre: string; oscuro?: boolean}> = ({n, nombre, oscuro}) => {
  const f = useCurrentFrame();
  const t = t01(f, 2, 14);
  const s = t01(f, DUR - 8, 8, EXPO_IO);
  return (
    <div style={{position: 'absolute', left: 60, top: 80, display: 'flex', alignItems: 'center', gap: 16, opacity: t * (1 - s), transform: `translateY(${(1 - t) * -20}px)`, fontFamily: FONT, zIndex: 50}}>
      <div style={{background: K.morado, color: K.blanco, fontWeight: 800, fontSize: 34, padding: '10px 18px', borderRadius: 14}}>{String(n).padStart(2, '0')}</div>
      <div style={{background: 'rgba(33,33,53,0.72)', backdropFilter: 'blur(12px)', color: K.blanco, fontWeight: 700, fontSize: 40, padding: '10px 22px', borderRadius: 14}}>{nombre}</div>
    </div>
  );
};

/** Ícono de trazo 24×24. */
export const Ico: React.FC<{d: string[]; size?: number; color?: string; w?: number}> = ({d, size = 56, color = K.blanco, w = 2}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
    {d.map((p, i) => (
      <path key={i} d={p} />
    ))}
  </svg>
);
export const IC = {
  cc: ['M3 6h18v12H3z', 'M10 10.5a2 2 0 100 3', 'M17 10.5a2 2 0 100 3'],
  tijeras: ['M6 9a3 3 0 100-6 3 3 0 000 6z', 'M6 21a3 3 0 100-6 3 3 0 000 6z', 'M8.5 7.5L20 19', 'M8.5 16.5L20 5'],
  mic: ['M12 3a3 3 0 00-3 3v6a3 3 0 006 0V6a3 3 0 00-3-3z', 'M5 11a7 7 0 0014 0', 'M12 18v3'],
  play: ['M7 4l13 8-13 8V4z'],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  corazon: ['M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z'],
  globo: ['M4 5h16v11H9l-5 4V5z'],
  enviar: ['M4 12l16-8-6 16-3-7-7-1z'],
  clip: ['M8 12l6-6a3 3 0 014 4l-8 8a5 5 0 01-7-7l7-7'],
};
