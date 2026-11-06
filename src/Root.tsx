import React from 'react';
import {Composition} from 'remotion';
import {SegundaCompra, LISTA} from './Video';
import {TOTAL, s} from './tiempos';
import {SegundaCompraMotion} from './v2/Video';
import {TOTAL as TOTAL2} from './v2/tiempos';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Versión 2 — motion graphics estilo explicativo (guion palabra por palabra) */}
    <Composition id="SegundaCompra-Motion" component={SegundaCompraMotion} durationInFrames={TOTAL2} fps={30} width={1080} height={1920} />
    {/* Versión 1 */}
    <Composition id="SegundaCompra" component={SegundaCompra} durationInFrames={s(TOTAL)} fps={30} width={1080} height={1920} />
    {LISTA.map(({id, C, dura}) => (
      <Composition key={id} id={`SegundaCompra-${id}`} component={C} durationInFrames={s(dura)} fps={30} width={1080} height={1920} />
    ))}
  </>
);
