import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, EASE, FONT} from '../tema';
import {Circulo, FondoClaro, IcoPersona, IcoTienda, Pieza, TextoEntra, prog, sombra} from '../base';

// «Tal vez no necesitas empezar por atraer más clientes. Necesitas dejar de perder el contacto con los que ya tienes.»
const T = {
  tienda: 6,
  clientes: 22, // «…atraer más clientes»
  pierde: 78, // «dejar de perder el contacto»: se apagan uno por uno
  contador: 70,
  texto: 140, // «Necesitas dejar de perder el contacto…»
  sale: 232,
};

const CX = 540;
const CY = 760;
const N = 8;
const R = 330;

export const E4Revelacion: React.FC = () => {
  const f = useCurrentFrame();
  const giro = interpolate(f, [0, 240], [0, 18]);
  const empuje = interpolate(f, [0, 240], [1, 1.05], {easing: EASE});
  const perdidos = Math.round(interpolate(f, [T.pierde, T.pierde + N * 6], [0, N], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const cont = prog(f, T.contador, 14);

  return (
    <AbsoluteFill>
      <FondoClaro abajo={C.lavanda} />
      <AbsoluteFill style={{transform: `scale(${empuje})`, transformOrigin: `${CX}px ${CY}px`}}>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
          {Array.from({length: N}).map((_, i) => {
            const ang = ((i / N) * 360 + giro - 90) * (Math.PI / 180);
            const x = CX + Math.cos(ang) * R;
            const y = CY + Math.sin(ang) * R;
            const nace = prog(f, T.clientes + i * 4, 16);
            const corte = prog(f, T.pierde + i * 6, 14);
            // la línea se retrae del cliente hacia la tienda
            const len = nace * (1 - corte);
            return (
              <line
                key={i}
                x1={CX}
                y1={CY}
                x2={CX + (x - CX) * len}
                y2={CY + (y - CY) * len}
                stroke={C.morado}
                strokeWidth={4}
                strokeLinecap="round"
                opacity={0.55 * (1 - corte * 0.6)}
              />
            );
          })}
        </svg>
        {Array.from({length: N}).map((_, i) => {
          const ang = ((i / N) * 360 + giro - 90) * (Math.PI / 180);
          const corte = prog(f, T.pierde + i * 6, 22);
          const d = R + corte * 90;
          const x = CX + Math.cos(ang) * d;
          const y = CY + Math.sin(ang) * d;
          const nace = prog(f, T.clientes + i * 4, 16);
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x - 56,
                top: y - 56,
                opacity: nace * (1 - corte * 0.65),
                transform: `scale(${(0.6 + 0.4 * nace) * (1 - corte * 0.2)})`,
                filter: `blur(${(1 - nace) * 12 + corte * 5}px) grayscale(${corte})`,
              }}
            >
              <Circulo size={112} bg={C.blanco} style={{boxShadow: sombra, border: `3px ${corte > 0.3 ? 'dashed' : 'solid'} ${corte > 0.3 ? '#B5B5C3' : C.morado}`}}>
                <IcoPersona size={58} color={corte > 0.3 ? '#B5B5C3' : C.morado} />
              </Circulo>
            </div>
          );
        })}
        <Pieza en={T.tienda} style={{position: 'absolute', left: CX - 130, top: CY - 130}}>
          <Circulo size={260} bg={C.morado} style={{boxShadow: '0 0 90px rgba(137,29,255,0.55)'}}>
            <IcoTienda size={140} color={C.blanco} stroke={1.6} />
          </Circulo>
        </Pieza>
      </AbsoluteFill>

      {/* Contador: clientes que compraron vs. con quienes hay contacto */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1230,
          display: 'flex',
          justifyContent: 'center',
          opacity: cont * (1 - prog(f, T.texto - 10, 8)),
          filter: `blur(${(1 - cont) * 10 + prog(f, T.texto - 10, 8) * 10}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 20, background: C.blanco, borderRadius: 16, padding: '22px 34px', boxShadow: sombra, fontFamily: FONT, fontSize: 46, fontWeight: 700, color: C.tinta}}>
          <span style={{color: C.morado, fontWeight: 800}}>{N - perdidos}</span>
          <span>clientes con contacto</span>
        </div>
      </div>

      <div style={{position: 'absolute', left: 0, right: 0, top: 1300}}>
        <TextoEntra lineas={['NO PIERDAS', [{t: 'EL CONTACTO.', color: C.morado}]]} en={T.texto} sale={T.sale} size={104} />
      </div>
    </AbsoluteFill>
  );
};
