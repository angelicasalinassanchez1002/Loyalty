import React from 'react';
import {Composition} from 'remotion';
import {SegundaCompra, LISTA} from './Video';
import {TOTAL, s} from './tiempos';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="SegundaCompra" component={SegundaCompra} durationInFrames={s(TOTAL)} fps={30} width={1080} height={1920} />
    {LISTA.map(({id, C, dura}) => (
      <Composition key={id} id={`SegundaCompra-${id}`} component={C} durationInFrames={s(dura)} fps={30} width={1080} height={1920} />
    ))}
  </>
);
