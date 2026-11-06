import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT, K, t01} from './kit';
import {FPS, FRASES} from './tiempos';

export const Subtitulos: React.FC = () => {
  const f = useCurrentFrame();
  const p = FRASES.find((x) => f >= Math.round(x.s * FPS) - 2 && f < Math.round(x.e * FPS));
  if (!p) return null;
  const a = Math.round(p.s * FPS) - 2;
  const b = Math.round(p.e * FPS);
  const op = t01(f, a, 4) * (1 - t01(f, b - 4, 4));
  return (
    <div style={{position: 'absolute', left: 60, right: 60, bottom: 110, display: 'flex', justifyContent: 'center', opacity: op}}>
      <div
        style={{
          maxWidth: 940,
          background: 'rgba(33,33,53,0.86)',
          color: K.blanco,
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 46,
          lineHeight: 1.2,
          textAlign: 'center',
          padding: '14px 28px',
          borderRadius: 18,
          transform: `translateY(${(1 - t01(f, a, 6)) * 10}px)`,
        }}
      >
        {p.texto}
      </div>
    </div>
  );
};
