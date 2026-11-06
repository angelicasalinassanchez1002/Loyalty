import React from 'react';
import {Composition} from 'remotion';
import {SegundaCompra, LISTA} from './Video';
import {TOTAL, s} from './tiempos';
import {SegundaCompraMotion} from './v2/Video';
import {TOTAL as TOTAL2} from './v2/tiempos';
import {DemoEfectos, EFECTOS, TOTAL_DEMO} from './efectos/Demo';
import {DUR} from './efectos/base';
import {NOMBRES} from './efectos/E15_20';

export const RemotionRoot: React.FC = () => (
  <>
    {/* Demo de 20 efectos (sin persona) y cada efecto por separado */}
    <Composition id="Demo-20-Efectos" component={DemoEfectos} durationInFrames={TOTAL_DEMO} fps={30} width={1080} height={1920} />
    {EFECTOS.map(({C, dur}, i) => (
      <Composition key={`ef${i}`} id={`Efecto-${String(i + 1).padStart(2, '0')}-${NOMBRES[i].replace(/[^A-Za-z]/g, '')}`} component={C} durationInFrames={dur ?? DUR} fps={30} width={1080} height={1920} />
    ))}
    {/* Versión 2 — motion graphics estilo explicativo (guion palabra por palabra) */}
    <Composition id="SegundaCompra-Motion" component={SegundaCompraMotion} durationInFrames={TOTAL2} fps={30} width={1080} height={1920} />
    {/* Versión 1 */}
    <Composition id="SegundaCompra" component={SegundaCompra} durationInFrames={s(TOTAL)} fps={30} width={1080} height={1920} />
    {LISTA.map(({id, C, dura}) => (
      <Composition key={id} id={`SegundaCompra-${id}`} component={C} durationInFrames={s(dura)} fps={30} width={1080} height={1920} />
    ))}
  </>
);
