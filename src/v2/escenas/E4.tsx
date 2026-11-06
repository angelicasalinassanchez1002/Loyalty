import React from 'react';
import {AbsoluteFill, Freeze, random, useCurrentFrame} from 'remotion';
import {Abs, Bokeh, FondoAnillos, Frase, I, Ico, K, Romper, keys, sombra, t01} from '../kit';
import {P} from '../tiempos';

// «Tal vez no necesitas empezar por atraer más clientes. Necesitas dejar de perder el contacto con los que ya tienes.»
// Efecto Frame Break: tras tachar «atraer más clientes», la pantalla se estrella y debajo aparece la red de clientes.
const k = 3;
const CX = 540;
const CY = 1010;
const N = 8;
const R = 300;

const tiempos = () => ({pAtraer: P(k, 'atraer más'), pNec: P(k, 'Necesitas dejar'), pPerder: P(k, 'perder el'), pCon: P(k, 'con los')});

/** Capa A: llegan clientes nuevos y se tacha «atraer más clientes». Es la que se estrella. */
const CapaA: React.FC = () => {
  const f = useCurrentFrame();
  const {pAtraer, pNec} = tiempos();
  const tacha = t01(f, pNec - 2, 14);
  return (
    <AbsoluteFill>
      <FondoAnillos />
      <Bokeh semilla="e4" n={4} opacidad={0.05} />
      <div style={{position: 'absolute', inset: 0, transform: 'scale(1.08)', transformOrigin: `${CX}px ${CY}px`}}>
        {/* Clientes nuevos que llegan desde fuera (se detienen al tacharse) */}
        {Array.from({length: 22}).map((_, i) => {
          const a = pAtraer - 14 + i * 2;
          const ang = random(`a${i}`) * Math.PI * 2;
          const d0 = 900 + random(`d${i}`) * 300;
          const viaje = t01(f, a, 30);
          const d = d0 * (1 - viaje) + 190 * viaje;
          const op = t01(f, a, 8);
          return (
            <div key={i} style={{position: 'absolute', left: CX + Math.cos(ang) * d - 24, top: CY + Math.sin(ang) * d - 24, width: 48, height: 48, borderRadius: 24, border: `4px solid ${K.morado}`, background: K.blanco, opacity: op * 0.9, boxSizing: 'border-box'}} />
          );
        })}
        {/* El negocio al centro */}
        <div style={{position: 'absolute', left: CX - 140, top: CY - 140, width: 280, height: 280, borderRadius: 140, background: K.morado, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 22px rgba(137,29,255,0.12), 0 30px 70px rgba(137,29,255,0.35)', transform: `scale(${t01(f, 0, 18)})`}}>
          <Ico d={I.tienda} size={150} color={K.blanco} w={1.6} />
        </div>
      </div>
      {/* Texto 1 (arriba) con tachado */}
      <Abs x={90} y={190}>
        <Frase k={k} desde="Tal vez" n={6} saltos={[3]} style={{fontSize: 70, fontWeight: 700, color: K.suave, lineHeight: 1.08}} />
      </Abs>
      <Abs x={90} y={360}>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <Frase k={k} desde="atraer más" n={3} acentos={['atraer', 'más', 'clientes.']} resalte={false} style={{fontSize: 104, fontWeight: 800, letterSpacing: '-0.02em'}} />
          <div style={{position: 'absolute', left: -10, right: -10, top: '52%', height: 12, borderRadius: 6, background: K.tinta, transformOrigin: 'left center', transform: `scaleX(${tacha})`}} />
        </div>
      </Abs>
    </AbsoluteFill>
  );
};

/** Capa B: la red de clientes actuales que pierde y recupera el contacto. */
const CapaB: React.FC = () => {
  const f = useCurrentFrame();
  const {pNec, pPerder, pCon} = tiempos();
  const cam = keys(f, [[0, 1.12], [pNec + 14, 1.12], [pNec + 40, 1]]);
  return (
    <AbsoluteFill>
      <FondoAnillos claro />
      <div style={{position: 'absolute', inset: 0, transform: `scale(${cam})`, transformOrigin: `${CX}px ${CY}px`}}>
        {/* Red de clientes actuales */}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          <defs>
            <radialGradient id="lg" cx={CX} cy={CY} r={R} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor={K.morado} stopOpacity={1} />
              <stop offset="1" stopColor={K.morado} stopOpacity={0.35} />
            </radialGradient>
          </defs>
          {Array.from({length: N}).map((_, i) => {
            const ang = ((i / N) * 360 - 90) * (Math.PI / 180);
            const nace = t01(f, pNec + 20 + i * 2, 16);
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
              <g key={i} stroke="url(#lg)" strokeWidth={6} strokeLinecap="round">
                <line x1={x0} y1={y0} x2={x1} y2={y1} />
                {corte < 0.98 && <line x1={x2} y1={y2} x2={x3} y2={y3} />}
              </g>
            );
          })}
        </svg>
        {Array.from({length: N}).map((_, i) => {
          const ang = ((i / N) * 360 - 90) * (Math.PI / 180);
          const nace = t01(f, pNec + 24 + i * 2, 16);
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
        {/* Ondas que salen del negocio */}
        {Array.from({length: 4}).map((_, j) => {
          const per = 54;
          const ph = ((f + j * (per / 4)) % per) / per;
          return (
            <div key={`o${j}`} style={{position: 'absolute', left: CX - 140, top: CY - 140, width: 280, height: 280, borderRadius: '50%', border: `3px solid ${K.morado}`, transform: `scale(${1 + ph * 2.6})`, opacity: (1 - ph) * 0.35 * (1 - t01(f, pPerder, 20)) + (1 - ph) * 0.35 * t01(f, pCon + 6, 20)}} />
          );
        })}
        {/* Chispas donde se rompe cada conexión */}
        {Array.from({length: N}).map((_, i) => {
          const a = pPerder + 2 + i * 3;
          const ang = ((i / N) * 360 - 90) * (Math.PI / 180);
          const mx = CX + Math.cos(ang) * R * 0.5;
          const my = CY + Math.sin(ang) * R * 0.5;
          const t = t01(f, a, 18);
          if (f < a || t >= 1) return null;
          return Array.from({length: 6}).map((__, q) => {
            const qa = ang + Math.PI / 2 + (q / 6) * Math.PI * 2 + random(`q${i}${q}`);
            const d = 10 + t * (40 + random(`d${i}${q}`) * 50);
            return <div key={`c${i}${q}`} style={{position: 'absolute', left: mx + Math.cos(qa) * d - 4, top: my + Math.sin(qa) * d - 4, width: 8, height: 8, borderRadius: 4, background: K.morado, opacity: 1 - t, transform: `scale(${1 - t * 0.6})`}} />;
          });
        })}
        {/* El negocio al centro */}
        <div style={{position: 'absolute', left: CX - 140, top: CY - 140, width: 280, height: 280, borderRadius: 140, background: K.morado, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 22px rgba(137,29,255,0.12), 0 30px 70px rgba(137,29,255,0.35)', transform: `scale(${t01(f, 0, 18)})`}}>
          <Ico d={I.tienda} size={150} color={K.blanco} w={1.6} />
        </div>
      </div>
      {/* Texto 2 (abajo) */}
      <Abs x={90} y={1430}>
        <Frase k={k} desde="Necesitas dejar" n={10} acentos={['perder', 'el', 'contacto']} saltos={[3, 6]} style={{fontSize: 88, fontWeight: 800, color: K.tinta, lineHeight: 1.06, letterSpacing: '-0.02em'}} />
      </Abs>
    </AbsoluteFill>
  );
};

export const E4: React.FC = () => {
  const f = useCurrentFrame();
  const {pNec} = tiempos();
  const grieta = pNec + 12;
  const cae = pNec + 18;
  return (
    <AbsoluteFill>
      <CapaB />
      <Romper impacto={{x: CX, y: 430}} grieta={grieta} cae={cae}>
        {f >= grieta ? (
          <Freeze frame={grieta}>
            <CapaA />
          </Freeze>
        ) : (
          <CapaA />
        )}
      </Romper>
    </AbsoluteFill>
  );
};
