import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Subtitulos} from './Subtitulos';
import {EXPO, EXPO_IO, K, t01} from './kit';
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

/** Envuelve una escena: efecto de entrada en sus primeros SOLAPE cuadros y acompañamiento de salida en los últimos. */
const Marco: React.FC<{entra: Tipo; saleCon?: Tipo; dur: number; children: React.ReactNode}> = ({entra, saleCon, dur, children}) => {
  const f = useCurrentFrame();
  const e = t01(f, 0, SOLAPE, EXPO_IO);
  const so = saleCon ? t01(f, dur - SOLAPE, SOLAPE, EXPO_IO) : 0;

  let estilo: React.CSSProperties = {};
  let borde: React.ReactNode = null;
  if (entra === 'zoom' && e < 1) estilo = {transform: `scale(${1.22 - 0.22 * t01(f, 0, SOLAPE, EXPO)})`, opacity: t01(f, 0, 8)};
  if (entra === 'iris' && e < 1) estilo = {clipPath: `circle(${e * 120}% at 50% 50%)`};
  if (entra === 'barrido' && e < 1) {
    estilo = {clipPath: `inset(0 0 0 ${(1 - e) * 100}%)`};
    borde = <div style={{position: 'absolute', top: 0, bottom: 0, left: `${(1 - e) * 100}%`, width: 14, marginLeft: -7, background: K.morado}} />;
  }
  if (entra === 'subir' && e < 1) estilo = {transform: `translateY(${(1 - e) * 1920}px)`};

  // La escena que sale acompaña a la que entra.
  if (saleCon === 'zoom') estilo = {...estilo, transform: `scale(${1 - 0.08 * so})`};
  if (saleCon === 'iris') estilo = {...estilo, transform: `scale(${1 + 0.06 * so})`};
  if (saleCon === 'barrido') estilo = {...estilo, transform: `translateX(${-260 * so}px)`};
  if (saleCon === 'subir') estilo = {...estilo, transform: `translateY(${-520 * so}px) scale(${1 - 0.08 * so})`};

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={estilo}>{children}</AbsoluteFill>
      {borde}
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
    <Subtitulos />
    {/* Música y efectos UX/UI generados por scripts/sonido.py */}
    <Audio src={staticFile('v2/sonido.wav')} />
  </AbsoluteFill>
);
