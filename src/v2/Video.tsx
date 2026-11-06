import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {EXPO, EXPO_IO, Grano, K, Vineta, t01} from './kit';
import {FIN, INICIOS, SOLAPE} from './tiempos';
import {E1} from './escenas/E1';
import {E2} from './escenas/E2';
import {E3} from './escenas/E3';
import {E4} from './escenas/E4';
import {E5} from './escenas/E5';

type Tipo = 'corte' | 'zoom' | 'iris' | 'barrido' | 'subir';
export const ESCENAS: {C: React.FC; entra: Tipo}[] = [
  {C: E1, entra: 'corte'},
  {C: E2, entra: 'zoom'},
  {C: E3, entra: 'iris'},
  {C: E4, entra: 'barrido'},
  {C: E5, entra: 'subir'},
];

/** Envuelve una escena: entrada por capas en sus primeros SOLAPE cuadros, acompañamiento de salida
 *  en los últimos, y una deriva de cámara lenta para que nada quede quieto. */
const Marco: React.FC<{entra: Tipo; saleCon?: Tipo; dur: number; children: React.ReactNode}> = ({entra, saleCon, dur, children}) => {
  const f = useCurrentFrame();
  const e = t01(f, 0, SOLAPE, EXPO_IO);
  const ee = t01(f, 0, SOLAPE + 4, EXPO);
  const so = saleCon ? t01(f, dur - SOLAPE, SOLAPE, EXPO_IO) : 0;
  const vel = Math.sin(Math.PI * e); // pico de velocidad a mitad de la transición
  const deriva = 1 + 0.025 * (f / dur);

  let est: React.CSSProperties = {};
  let capas: React.ReactNode = null;
  const transform: string[] = [];
  const filtros: string[] = [];

  if (f < SOLAPE + 4) {
    if (entra === 'zoom') {
      transform.push(`scale(${1.28 - 0.28 * ee})`);
      filtros.push(`blur(${(1 - ee) * 26}px)`);
      est.opacity = t01(f, 0, 9);
    }
    if (entra === 'iris') {
      est.clipPath = `circle(${e * 118}% at 50% 52%)`;
      capas = (
        <>
          <div style={{position: 'absolute', left: '50%', top: '52%', width: 0, height: 0}}>
            <div style={{position: 'absolute', width: e * 2 * 2350, height: e * 2 * 2350, left: -e * 2350, top: -e * 2350, borderRadius: '50%', border: `${18 * (1 - e) + 4}px solid ${K.morado}`, opacity: 1 - e * 0.6}} />
          </div>
        </>
      );
    }
    if (entra === 'barrido') {
      const x = (1 - e) * 100;
      est.clipPath = `inset(0 0 0 ${x}%)`;
      capas = (
        <>
          <div style={{position: 'absolute', top: -200, bottom: -200, left: `calc(${x}% - 40px)`, width: 120, background: K.tinta, transform: 'skewX(-10deg)', filter: `blur(${vel * 6}px)`}} />
          <div style={{position: 'absolute', top: -200, bottom: -200, left: `calc(${Math.max(0, (1 - t01(f, -3, SOLAPE, EXPO_IO)) * 100)}% - 60px)`, width: 140, background: K.morado, transform: 'skewX(-10deg)', filter: `blur(${vel * 8}px)`}} />
        </>
      );
      filtros.push(`blur(${vel * 6}px)`);
    }
    if (entra === 'subir') {
      transform.push(`translateY(${(1 - e) * 1920}px)`);
      est.borderRadius = `${80 * (1 - e)}px ${80 * (1 - e)}px 0 0`;
      est.overflow = 'hidden';
      est.boxShadow = `0 -40px 120px rgba(33,33,53,${0.35 * (1 - e)})`;
      filtros.push(`blur(${vel * 5}px)`);
    }
  }

  // La escena que sale acompaña a la que entra.
  let sombraSale = 0;
  if (so > 0) {
    if (saleCon === 'zoom') {
      transform.push(`scale(${1 - 0.12 * so})`);
      filtros.push(`blur(${so * 18}px)`);
    }
    if (saleCon === 'iris') {
      transform.push(`scale(${1 + 0.1 * so})`);
      filtros.push(`blur(${so * 10}px)`);
    }
    if (saleCon === 'barrido') {
      transform.push(`translateX(${-320 * so}px)`);
      filtros.push(`blur(${Math.sin(Math.PI * so) * 8}px)`);
    }
    if (saleCon === 'subir') {
      transform.push(`translateY(${-160 * so}px) scale(${1 - 0.1 * so})`);
      filtros.push(`blur(${so * 6}px)`);
      sombraSale = so * 0.45;
    }
  }
  transform.push(`scale(${deriva})`);

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{...est, transform: transform.join(' '), filter: filtros.join(' ') || undefined}}>
        {children}
        {sombraSale > 0 && <AbsoluteFill style={{background: K.tinta, opacity: sombraSale}} />}
      </AbsoluteFill>
      {capas}
    </AbsoluteFill>
  );
};

export const SegundaCompraMotion: React.FC = () => (
  <AbsoluteFill style={{background: K.blanco}}>
    {ESCENAS.map(({C, entra}, k) => {
      const ultima = k === ESCENAS.length - 1;
      const dur = FIN(k) - INICIOS[k] + (ultima ? 0 : SOLAPE);
      return (
        <Sequence key={k} from={INICIOS[k]} durationInFrames={dur} name={`Escena ${k + 1}`}>
          <Marco entra={entra} saleCon={ultima ? undefined : ESCENAS[k + 1].entra} dur={dur}>
            <C />
          </Marco>
        </Sequence>
      );
    })}
    <Vineta fuerza={0.08} />
    <Grano opacidad={0.07} />
    {/* Música y efectos UX/UI generados por scripts/sonido.py */}
    <Audio src={staticFile('v2/sonido.wav')} />
  </AbsoluteFill>
);
