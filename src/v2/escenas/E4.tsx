import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {Abs, FondoAnillos, Frase, I, Ico, K, keys, sombra, t01} from '../kit';
import {P} from '../tiempos';

// «Tal vez no necesitas empezar por atraer más clientes. Necesitas dejar de perder el contacto con los que ya tienes.»
const k = 3;
const CX = 540;
const CY = 1010;
const N = 8;
const R = 300;

export const E4: React.FC = () => {
  const f = useCurrentFrame();
  const pAtraer = P(k, 'atraer más');
  const pNec = P(k, 'Necesitas dejar');
  const pPerder = P(k, 'perder el');
  const pCon = P(k, 'con los');

  const tacha = t01(f, pNec - 2, 14);
  const cam = keys(f, [[0, 1.08], [pNec, 1.08], [pNec + 24, 1]]);

  return (
    <AbsoluteFill>
      <FondoAnillos />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: `${CX}px ${CY}px`}}>
        {/* Clientes nuevos que llegan desde fuera (se detienen al tacharse) */}
        {Array.from({length: 22}).map((_, i) => {
          const a = pAtraer - 14 + i * 2;
          const ang = random(`a${i}`) * Math.PI * 2;
          const d0 = 900 + random(`d${i}`) * 300;
          const viaje = t01(f, a, 30);
          const d = d0 * (1 - viaje) + 190 * viaje;
          const op = t01(f, a, 8) * (1 - t01(f, pNec, 10));
          return (
            <div key={i} style={{position: 'absolute', left: CX + Math.cos(ang) * d - 24, top: CY + Math.sin(ang) * d - 24, width: 48, height: 48, borderRadius: 24, border: `4px solid ${K.morado}`, background: K.blanco, opacity: op * 0.9, boxSizing: 'border-box'}} />
          );
        })}

        {/* Red de clientes actuales */}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          {Array.from({length: N}).map((_, i) => {
            const ang = ((i / N) * 360 - 90) * (Math.PI / 180);
            const nace = t01(f, pNec + 4 + i * 2, 16);
            const corte = t01(f, pPerder + 2 + i * 3, 14);
            const x = CX + Math.cos(ang) * R;
            const y = CY + Math.sin(ang) * R;
            // la línea se parte a la mitad y cada mitad se retrae
            const m = 0.5;
            const a1 = m * (1 - corte);
            const a2 = m + m * corte;
            const P1 = (t: number) => [CX + (x - CX) * t * nace, CY + (y - CY) * t * nace];
            const [x0, y0] = P1(0);
            const [x1, y1] = P1(a1);
            const [x2, y2] = P1(a2);
            const [x3, y3] = P1(1);
            return (
              <g key={i} stroke={K.morado} strokeWidth={6} strokeLinecap="round">
                <line x1={x0} y1={y0} x2={x1} y2={y1} />
                {corte < 0.98 && <line x1={x2} y1={y2} x2={x3} y2={y3} />}
              </g>
            );
          })}
        </svg>
        {Array.from({length: N}).map((_, i) => {
          const ang = ((i / N) * 360 - 90) * (Math.PI / 180);
          const nace = t01(f, pNec + 8 + i * 2, 16);
          const corte = t01(f, pPerder + 2 + i * 3, 14);
          const vuelve = t01(f, pCon + 4 + i * 2, 14);
          const x = CX + Math.cos(ang) * (R + 40 * corte * (1 - vuelve));
          const y = CY + Math.sin(ang) * (R + 40 * corte * (1 - vuelve));
          const apagado = corte * (1 - vuelve);
          return (
            <div key={i} style={{position: 'absolute', left: x - 64, top: y - 64, width: 128, height: 128, transform: `scale(${nace})`}}>
              {vuelve > 0 && (
                <div style={{position: 'absolute', inset: -18 - 14 * vuelve, borderRadius: '50%', border: `5px solid ${K.morado}`, opacity: vuelve * (1 - t01(f, pCon + 30 + i * 2, 20)) }} />
              )}
              <div style={{width: 128, height: 128, borderRadius: 64, background: K.blanco, border: `5px ${apagado > 0.5 ? 'dashed' : 'solid'} ${apagado > 0.5 ? K.tenue : K.morado}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: sombra, opacity: 1 - apagado * 0.45}}>
                <Ico d={I.persona} size={64} color={apagado > 0.5 ? K.tenue : K.morado} />
              </div>
            </div>
          );
        })}
        {/* El negocio al centro */}
        <div style={{position: 'absolute', left: CX - 140, top: CY - 140, width: 280, height: 280, borderRadius: 140, background: K.morado, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 22px rgba(137,29,255,0.12), 0 30px 70px rgba(137,29,255,0.35)', transform: `scale(${t01(f, 0, 18)})`}}>
          <Ico d={I.tienda} size={150} color={K.blanco} w={1.6} />
        </div>
      </div>

      {/* Texto 1 (arriba) con tachado */}
      <Abs x={90} y={190}>
        <Frase k={k} desde="Tal vez" n={6} saltos={[3]} sale={pNec + 16} style={{fontSize: 70, fontWeight: 700, color: K.suave, lineHeight: 1.08}} />
      </Abs>
      <Abs x={90} y={360}>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <Frase k={k} desde="atraer más" n={3} acentos={['atraer', 'más', 'clientes.']} resalte={false} sale={pNec + 16} style={{fontSize: 104, fontWeight: 800, letterSpacing: '-0.02em'}} />
          <div style={{position: 'absolute', left: -10, right: -10, top: '52%', height: 12, borderRadius: 6, background: K.tinta, transformOrigin: 'left center', transform: `scaleX(${tacha})`, opacity: 1 - t01(f, pNec + 16, 10)}} />
        </div>
      </Abs>

      {/* Texto 2 (abajo) */}
      <Abs x={90} y={1430}>
        <Frase k={k} desde="Necesitas dejar" n={10} acentos={['perder', 'el', 'contacto']} saltos={[3, 6]} style={{fontSize: 88, fontWeight: 800, color: K.tinta, lineHeight: 1.06, letterSpacing: '-0.02em'}} />
      </Abs>
    </AbsoluteFill>
  );
};
