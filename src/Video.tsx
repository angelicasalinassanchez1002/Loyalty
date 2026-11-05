import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {ESCENAS, s} from './tiempos';
import {E1Gancho} from './escenas/E1Gancho';
import {E2Dolor} from './escenas/E2Dolor';
import {E3Consecuencia} from './escenas/E3Consecuencia';
import {E4Revelacion} from './escenas/E4Revelacion';
import {E5OpenLoop} from './escenas/E5OpenLoop';

export const LISTA = [
  {id: 'Escena1', C: E1Gancho, ...ESCENAS.e1},
  {id: 'Escena2', C: E2Dolor, ...ESCENAS.e2},
  {id: 'Escena3', C: E3Consecuencia, ...ESCENAS.e3},
  {id: 'Escena4', C: E4Revelacion, ...ESCENAS.e4},
  {id: 'Escena5', C: E5OpenLoop, ...ESCENAS.e5},
];

export const SegundaCompra: React.FC = () => (
  <AbsoluteFill style={{background: '#fff'}}>
    {LISTA.map(({id, C, desde, dura}) => (
      <Sequence key={id} from={s(desde)} durationInFrames={s(dura)} name={id}>
        <C />
      </Sequence>
    ))}
  </AbsoluteFill>
);
