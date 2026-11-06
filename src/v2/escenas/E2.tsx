import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {Abs, Bokeh, Camara, EXPO, Entra3D, FONT, FondoDiagonales, Frase, I, Ico, K, Reflejo, keys, sombra, t01} from '../kit';
import {P} from '../tiempos';

// «Y mientras sigues buscando clientes nuevos, los que ya te compraron se van sin que sepas quiénes son.»
const k = 1;

const Anuncio: React.FC<{en: number; titulo: string; dato: string}> = ({en, titulo, dato}) => {
  return (
    <Entra3D en={en} rx={35} dy={60} dur={22}>
    <div style={{display: 'flex', alignItems: 'center', gap: 26, background: K.blanco, borderRadius: 26, padding: '28px 32px', boxShadow: sombra, marginBottom: 24, position: 'relative', overflow: 'hidden', border: '1px solid rgba(33,33,53,0.05)'}}>
      <Reflejo en={en + 10} />
      <div style={{width: 84, height: 84, borderRadius: 22, background: 'rgba(137,29,255,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Ico d={I.mega} size={46} />
      </div>
      <div style={{flex: 1, fontFamily: FONT}}>
        <div style={{fontSize: 46, fontWeight: 700, color: K.tinta}}>{titulo}</div>
        <div style={{fontSize: 34, fontWeight: 600, color: K.suave}}>{dato}</div>
      </div>
    </div>
    </Entra3D>
  );
};

export const E2: React.FC = () => {
  const f = useCurrentFrame();
  const pBusc = P(k, 'buscando');
  const pLos = P(k, 'los que');
  const pSeVan = P(k, 'se van');
  const pSin = P(k, 'sin que');

  // La cámara baja del buscador a la fila de clientes.
  const camY = keys(f, [[0, 960], [pLos - 10, 960], [pLos + 14, 2260]]);
  const caret = Math.floor(f / 8) % 2 === 0 ? 1 : 0;
  const barra = t01(f, 0, 18);

  return (
    <AbsoluteFill>
      <FondoDiagonales />
      <Bokeh semilla="e2" n={4} opacidad={0.05} />
      <Camara cx={540} cy={camY} s={1}>
        {/* Parte 1: buscador */}
        <Abs x={90} y={250}>
          <Frase k={k} desde="Y mientras" n={3} style={{fontSize: 64, fontWeight: 700, color: K.suave}} />
        </Abs>
        <Abs x={90} y={360}>
          <div style={{position: 'absolute', inset: -30, borderRadius: 999, background: K.morado, opacity: 0.18 * barra, filter: 'blur(40px)'}} />
          <div style={{width: 900, transform: `scaleX(${0.4 + 0.6 * barra})`, opacity: barra, transformOrigin: 'left center', borderRadius: 999, padding: 5, background: `conic-gradient(from ${f * 6}deg, ${K.morado}, rgba(137,29,255,0.15), ${K.morado}, rgba(137,29,255,0.15), ${K.morado})`, boxShadow: '0 20px 60px rgba(137,29,255,0.18)', boxSizing: 'border-box'}}>
          <div style={{background: K.blanco, borderRadius: 999, padding: '30px 40px', display: 'flex', alignItems: 'center', gap: 26}}>
            <Ico d={I.buscar} size={64} w={2.4} />
            <Frase k={k} desde="buscando" n={3} acentos={['nuevos']} style={{fontSize: 62, fontWeight: 700, color: K.tinta, whiteSpace: 'nowrap'}} />
            <div style={{width: 5, height: 66, background: K.morado, opacity: f > pBusc + 20 ? caret : 1}} />
          </div>
          </div>
        </Abs>
        {/* Headline Storm: promociones que entran de golpe mientras se buscan clientes nuevos */}
        {[
          {t: '2x1 EN TACOS AL PASTOR', bg: K.morado, c: K.blanco, rot: -8, y: 640, desde: -1, en: pBusc + 4},
          {t: 'PROMO DE MARTES', bg: K.blanco, c: K.tinta, rot: 6, y: 830, desde: 1, en: pBusc + 10},
          {t: 'CUPÓN DE BIENVENIDA', bg: K.tinta, c: K.blanco, rot: -4, y: 1010, desde: -1, en: pBusc + 16},
          {t: 'CLIENTES NUEVOS', bg: K.morado, c: K.blanco, rot: 9, y: 1180, desde: 1, en: pBusc + 22},
        ].map((c) => {
          const p = t01(f, c.en, 9, EXPO);
          const des = Math.max(0, f - c.en) * 3;
          return (
            <div key={c.t} style={{position: 'absolute', left: -300, top: c.y, width: 1680, height: 140, background: c.bg, transform: `rotate(${c.rot}deg) translateX(${(1 - p) * c.desde * 1900 - des * c.desde}px)`, display: 'flex', alignItems: 'center', boxShadow: '0 24px 50px rgba(33,33,53,0.28)', overflow: 'hidden', filter: `blur(${(1 - p) * 10}px)`}}>
              <div style={{whiteSpace: 'nowrap', fontFamily: FONT, fontWeight: 800, fontSize: 84, color: c.c, letterSpacing: '-0.01em', paddingLeft: 330}}>
                {c.t} · {c.t} · {c.t}
              </div>
            </div>
          );
        })}

        {/* Parte 2: los que ya te compraron */}
        <Abs x={90} y={1600}>
          <Frase k={k} desde="los que" n={5} acentos={['compraron']} saltos={[3]} style={{fontSize: 96, fontWeight: 800, color: K.tinta, lineHeight: 1.02, letterSpacing: '-0.02em'}} />
        </Abs>
        {/* carril */}
        <Abs x={0} y={2296}>
          <div style={{width: 1080, height: 6, backgroundImage: `repeating-linear-gradient(90deg, ${K.tenue} 0 22px, transparent 22px 40px)`}} />
        </Abs>
        {/* salida a la derecha */}
        <Abs x={560} y={2010}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <Frase k={k} desde="se van" n={2} acentos={['van']} style={{fontSize: 84, fontWeight: 800, color: K.tinta}} />
            <svg width={120} height={60} viewBox="0 0 120 60" style={{opacity: t01(f, pSeVan + 4, 10), transform: `translateX(${(1 - t01(f, pSeVan + 4, 14)) * -30}px)`}}>
              <path d="M6 30h100M80 8l26 22-26 22" stroke={K.morado} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>
        </Abs>
        {Array.from({length: 9}).map((_, i) => {
          const a = pLos - 6 + i * 11;
          const x = interpolate(f, [a, a + 70], [-140, 1220], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
          if (f < a) return null;
          const anon = f >= pSin + 2 || x > 620;
          const tq = anon ? t01(f, Math.max(pSin + 2, a + 40), 8) : 0;
          const prof = i % 3 === 1 ? 0.82 : 1;
          const v = Math.abs(x - interpolate(f - 1, [a, a + 70], [-140, 1220], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
          return (
            <div key={i} style={{position: 'absolute', left: x - 70, top: 2160 + (i % 2) * 6, transform: `scale(${prof})`, filter: prof < 1 ? 'blur(2px)' : undefined, zIndex: prof < 1 ? 0 : 1}}>
              <div style={{position: 'absolute', right: 70, top: 40, height: 60, width: v * 6, borderRadius: 30, background: `linear-gradient(90deg, rgba(137,29,255,0), rgba(137,29,255,0.22))`, filter: 'blur(8px)'}} />
              <div style={{width: 140, height: 140, borderRadius: 70, background: anon && tq > 0.5 ? K.niebla : i % 3 === 0 ? K.morado : K.blanco, border: `4px solid ${anon && tq > 0.5 ? K.tenue : K.morado}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: sombra, boxSizing: 'border-box'}}>
                {anon && tq > 0.5 ? (
                  <span style={{fontFamily: FONT, fontWeight: 800, fontSize: 76, color: K.suave, transform: `scale(${0.6 + 0.4 * tq})`}}>?</span>
                ) : (
                  <Ico d={I.persona} size={74} color={i % 3 === 0 ? K.blanco : K.morado} />
                )}
              </div>
              <div style={{position: 'absolute', right: -8, top: -6, width: 54, height: 54, borderRadius: 27, background: K.blanco, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: sombra}}>
                <Ico d={I.bolsa} size={30} />
              </div>
            </div>
          );
        })}
        <Abs x={90} y={2560}>
          <Frase k={k} desde="sin que" n={5} acentos={['quiénes', 'son']} saltos={[3]} style={{fontSize: 96, fontWeight: 800, color: K.tinta, lineHeight: 1.02, letterSpacing: '-0.02em'}} />
        </Abs>
      </Camara>
    </AbsoluteFill>
  );
};
