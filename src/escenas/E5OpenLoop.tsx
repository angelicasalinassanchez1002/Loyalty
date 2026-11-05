import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, EASE, FONT} from '../tema';
import {FondoBlanco, IcoCheck, Pieza, TextoEntra, prog} from '../base';

// «Porque la primera compra ya la conseguiste. La pregunta es: ¿cómo haces para que haya una segunda?»
const T = {
  primera: 8, // «la primera compra ya la conseguiste»
  segunda: 26,
  salePastillas: 100,
  texto: 112, // «¿cómo haces para que haya una segunda?»
};

export const E5OpenLoop: React.FC = () => {
  const f = useCurrentFrame();
  const empuje = interpolate(f, [T.texto, 240], [1, 1.035], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE});
  const pulso = 0.5 + 0.5 * Math.sin((f - T.segunda) / 9);
  const pill: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    borderRadius: 16,
    padding: '26px 36px',
    fontFamily: FONT,
    fontSize: 46,
    fontWeight: 700,
  };
  return (
    <AbsoluteFill>
      <FondoBlanco />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 34}}>
        {f < T.salePastillas + 12 && (
          <>
            <Pieza en={T.primera} sale={T.salePastillas}>
              <div style={{...pill, background: C.morado, color: C.blanco, boxShadow: '0 0 70px rgba(137,29,255,0.45)'}}>
                <IcoCheck size={46} color={C.blanco} stroke={2.6} />
                1.ª compra
              </div>
            </Pieza>
            <Pieza en={T.segunda} sale={T.salePastillas + 3}>
              <div style={{...pill, background: C.blanco, color: '#9C9CAE', border: `3px dashed ${f > T.segunda + 16 ? `rgba(137,29,255,${0.3 + 0.5 * pulso})` : '#CFCFDA'}`}}>
                <span style={{width: 46, textAlign: 'center', fontWeight: 800, color: C.morado}}>?</span>
                2.ª compra
              </div>
            </Pieza>
          </>
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: `scale(${empuje})`}}>
        <TextoEntra
          lineas={['¿Y LA', [{t: 'SEGUNDA', color: C.morado}], [{t: 'COMPRA?', color: C.morado}]]}
          en={T.texto}
          size={156}
          porLetra
          pasoPalabra={2}
          lineHeight={1.0}
          style={{letterSpacing: '-0.02em'}}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
