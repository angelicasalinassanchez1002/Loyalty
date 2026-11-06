import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Abs, EXPO, FONT, Frase, I, Ico, K, keys, t01} from '../kit';
import {P} from '../tiempos';

// «Porque la primera compra ya la conseguiste. La pregunta es: ¿cómo haces para que haya una segunda?»
// Cierra con «¿Y LA SEGUNDA COMPRA?» (Gantari ExtraBold, «SEGUNDA COMPRA» en morado).
const k = 4;
const N1 = {x: 250, y: 1000};
const N2 = {x: 830, y: 1000};

const Letras: React.FC<{texto: string; en: number; color: string; size: number}> = ({texto, en, color, size}) => {
  const f = useCurrentFrame();
  return (
    <div style={{fontFamily: FONT, fontWeight: 800, fontSize: size, lineHeight: 1.0, letterSpacing: '-0.025em', color, whiteSpace: 'nowrap'}}>
      {Array.from(texto).map((ch, i) => {
        const t = t01(f, en + i * 2, 16, EXPO);
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', padding: '0.05em 0 0.1em', margin: '-0.05em 0 -0.1em'}}>
            <span style={{display: 'inline-block', transform: `translateY(${(1 - t) * 110}%)`, whiteSpace: 'pre'}}>{ch}</span>
          </span>
        );
      })}
    </div>
  );
};

export const E5: React.FC = () => {
  const f = useCurrentFrame();
  const pPrim = P(k, 'primera compra');
  const pCons = P(k, 'conseguiste.');
  const pPreg = P(k, 'La pregunta');
  const pSeg = P(k, 'una segunda?');
  const zoom = pSeg + 22;
  const titulo = zoom + 16;

  // La cámara entra al segundo nodo hasta que su interior blanco llena la pantalla.
  const s = keys(f, [[0, 1], [zoom, 1], [zoom + 22, 26]]);
  const nodo1 = t01(f, pPrim, 18);
  const check = t01(f, pCons + 4, 14);
  const linea = t01(f, pPreg, 24);
  const nodo2 = t01(f, pPreg + 14, 18);
  const pulso = f > pSeg ? 1 + 0.06 * Math.sin((f - pSeg) / 4) : 1;
  const textos = 1 - t01(f, zoom - 2, 10);

  return (
    <AbsoluteFill style={{background: K.blanco}}>
      <div style={{position: 'absolute', inset: 0, transformOrigin: `${N2.x}px ${N2.y}px`, transform: `scale(${s})`}}>
        <Abs x={90} y={300} style={{opacity: textos}}>
          <Frase k={k} desde="Porque la" n={7} acentos={['primera', 'compra']} saltos={[2, 4]} style={{fontSize: 88, fontWeight: 800, color: K.tinta, lineHeight: 1.06, letterSpacing: '-0.02em'}} />
        </Abs>
        {/* pista */}
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: textos}}>
          <line x1={N1.x} y1={N1.y} x2={N1.x + (N2.x - N1.x) * linea} y2={N2.y} stroke={K.morado} strokeWidth={8} strokeLinecap="round" strokeDasharray="2 26" />
        </svg>
        <div style={{position: 'absolute', left: N1.x - 95, top: N1.y - 95, width: 190, height: 190, borderRadius: 95, background: K.morado, transform: `scale(${nodo1})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 20px rgba(137,29,255,0.12)', opacity: textos}}>
          <svg width={110} height={110} viewBox="0 0 24 24" fill="none" stroke={K.blanco} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} strokeDasharray={`${check} 1`} />
          </svg>
        </div>
        <Abs x={N1.x - 160} y={N1.y + 130} style={{width: 320, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 46, color: K.tinta, opacity: nodo1 * textos}}>1.ª compra</Abs>
        <div style={{position: 'absolute', left: N2.x - 95, top: N2.y - 95, width: 190, height: 190, borderRadius: 95, background: K.blanco, border: `6px dashed ${K.morado}`, boxSizing: 'border-box', transform: `scale(${nodo2 * pulso})`, opacity: 1 - t01(f, zoom + 8, 12), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 110, color: K.morado, opacity: textos}}>?</span>
        </div>
        <Abs x={N2.x - 160} y={N2.y + 130} style={{width: 320, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: 46, color: K.suave, opacity: nodo2 * textos}}>2.ª compra</Abs>
        <Abs x={90} y={1290} style={{opacity: textos}}>
          <Frase k={k} desde="La pregunta" n={3} style={{fontSize: 60, fontWeight: 700, color: K.suave}} />
          <Frase k={k} desde="cómo haces" n={7} acentos={['segunda?']} saltos={[4]} style={{fontSize: 88, fontWeight: 800, color: K.tinta, lineHeight: 1.06, letterSpacing: '-0.02em', marginTop: 10}} />
        </Abs>
      </div>

      {/* Cierre */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 6}}>
        <Letras texto="¿Y LA" en={titulo} color={K.tinta} size={170} />
        <Letras texto="SEGUNDA" en={titulo + 8} color={K.morado} size={170} />
        <Letras texto="COMPRA?" en={titulo + 20} color={K.morado} size={170} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
