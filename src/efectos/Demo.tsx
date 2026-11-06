import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import {DUR, Etiqueta} from './base';
import {ChatTakeover, ChecklistPop, FrameEscape, HeadlineStorm, Orbit, SnapZoom, ZoomPortal} from './E01_07';
import {BrollOverlay, DollyZoom, GrowthCurve, LiquidGlass, MagazineCover, PaperCutout, StudioReveal} from './E08_14';
import {ChecklistCierre, DigitalZoom, FrameBreak, GreenScreen, NOMBRES, PhoneMockup, ZoomThroughCut} from './E15_20';
import {Grano} from '../v2/kit';

export const EFECTOS: {C: React.FC; oscuro?: boolean; dur?: number}[] = [
  {C: Orbit},
  {C: ChatTakeover, oscuro: true},
  {C: FrameEscape, oscuro: true},
  {C: SnapZoom},
  {C: ChecklistPop},
  {C: HeadlineStorm},
  {C: ZoomPortal, oscuro: true},
  {C: GrowthCurve, oscuro: true},
  {C: StudioReveal, oscuro: true},
  {C: BrollOverlay, oscuro: true},
  {C: PaperCutout},
  {C: DollyZoom},
  {C: MagazineCover},
  {C: LiquidGlass},
  {C: ZoomThroughCut},
  {C: GreenScreen},
  {C: FrameBreak, oscuro: true},
  {C: DigitalZoom, oscuro: true},
  {C: PhoneMockup},
  {C: ChecklistCierre, oscuro: true, dur: 150},
];
export const INICIO_EFECTO = EFECTOS.reduce<number[]>((acc, e, i) => [...acc, i === 0 ? 0 : acc[i - 1] + (EFECTOS[i - 1].dur ?? DUR)], []);
export const TOTAL_DEMO = INICIO_EFECTO[EFECTOS.length - 1] + (EFECTOS[EFECTOS.length - 1].dur ?? DUR);

export const DemoEfectos: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {EFECTOS.map(({C, oscuro, dur}, i) => (
      <Sequence key={i} from={INICIO_EFECTO[i]} durationInFrames={dur ?? DUR} name={`${i + 1} · ${NOMBRES[i]}`}>
        <C />
        {i < 19 && <Etiqueta n={i + 1} nombre={NOMBRES[i]} oscuro={oscuro} />}
      </Sequence>
    ))}
    <Grano opacidad={0.05} />
    <Audio src={staticFile('efectos/sonido.wav')} />
  </AbsoluteFill>
);
