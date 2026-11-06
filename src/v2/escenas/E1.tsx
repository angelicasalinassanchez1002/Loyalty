import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Abs, Camara, FONT, FondoPuntos, Frase, I, Ico, K, keys, sombra, t01} from '../kit';
import {P} from '../tiempos';

// «Le encantó tu negocio. Te compró. Y nunca volvió.»
const k = 0;

// Ruta punteada que sale por la puerta y abandona el cuadro.
const RUTA = 'M 800 1235 C 800 1380, 900 1420, 960 1520 S 1080 1700, 1240 1760';

export const E1: React.FC = () => {
  const f = useCurrentFrame();
  const pY = P(k, 'Y nunca');
  const pNunca = P(k, 'nunca');
  const pTe = P(k, 'Te compró.');

  // Cámara: empieza dentro del ticket y se aleja para revelar el café.
  const s = keys(f, [[0, 2.15], [pY - 6, 2.0], [pY + 16, 1]]);
  const cx = keys(f, [[0, 440], [pY - 6, 440], [pY + 16, 540]]);
  const cy = keys(f, [[0, 850], [pY - 6, 860], [pY + 16, 1010]]);

  const impreso = t01(f, 0, 22); // el ticket sale de la impresora
  const fachada = t01(f, pY - 4, 18);
  const sale = t01(f, pNunca, 34); // el cliente recorre la ruta
  const ruta = t01(f, pNunca - 4, 30);
  const puerta = t01(f, pNunca + 22, 10); // la puerta se cierra
  const check = t01(f, pTe + 2, 12);

  return (
    <AbsoluteFill>
      <FondoPuntos />
      <Camara cx={cx} cy={cy} s={s}>
        {/* Fachada del café */}
        <div style={{opacity: fachada}}>
          <Abs x={140} y={560}>
            <div style={{width: 800, height: 680, borderRadius: 36, background: K.blanco, boxShadow: sombra, overflow: 'hidden', position: 'relative'}}>
              <div style={{display: 'flex', height: 110}}>
                {Array.from({length: 8}).map((_, i) => (
                  <div key={i} style={{flex: 1, background: i % 2 ? K.blanco : K.morado}} />
                ))}
              </div>
              <div style={{position: 'absolute', left: 40, top: 150, width: 520, height: 490, borderRadius: 22, background: K.niebla}} />
              {/* puerta */}
              <div style={{position: 'absolute', left: 590, top: 340, width: 170, height: 340, borderRadius: '18px 18px 0 0', background: K.niebla}} />
              <div
                style={{
                  position: 'absolute',
                  left: 590,
                  top: 340,
                  width: 170,
                  height: 340,
                  borderRadius: '18px 18px 0 0',
                  background: K.tinta,
                  transformOrigin: 'left center',
                  transform: `scaleX(${0.18 + 0.82 * puerta})`,
                }}
              >
                <div style={{position: 'absolute', right: 22, top: 170, width: 12, height: 44, borderRadius: 6, background: K.blanco, opacity: puerta}} />
              </div>
            </div>
          </Abs>
          <Abs x={140} y={1240}>
            <div style={{width: 800, height: 6, borderRadius: 3, background: K.tinta, opacity: 0.12}} />
          </Abs>
        </div>

        {/* Ticket (vive dentro de la ventana del café) */}
        <Abs x={260} y={720}>
          <div style={{width: 360, position: 'relative'}}>
            <div style={{position: 'absolute', left: -20, top: -14, width: 400, height: 24, borderRadius: 12, background: K.tinta}} />
            <div style={{height: 470 * impreso, overflow: 'hidden', position: 'relative', top: 4}}>
              <div style={{width: 360, height: 470, background: K.blanco, boxShadow: sombra, padding: '30px 30px', boxSizing: 'border-box', fontFamily: FONT, color: K.tinta}}>
                <div style={{fontSize: 17, fontWeight: 700, letterSpacing: '0.12em', color: K.suave}}>CAFÉ · MESA 4 · 13:42</div>
                <Frase k={k} desde="Le encantó" n={4} acentos={['encantó']} saltos={[2]} style={{fontSize: 40, fontWeight: 700, lineHeight: 1.05, marginTop: 14}} />
                <div style={{borderTop: `2px dashed ${K.tenue}`, margin: '18px 0 14px'}} />
                {[
                  ['Café de olla', '$45'],
                  ['Chilaquiles verdes', '$145'],
                  ['Concha de vainilla', '$35'],
                ].map(([a, b]) => (
                  <div key={a} style={{display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 600, marginBottom: 8}}>
                    <span>{a}</span>
                    <span style={{color: K.suave}}>{b}</span>
                  </div>
                ))}
                <div style={{borderTop: `2px dashed ${K.tenue}`, margin: '14px 0 16px'}} />
                <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
                  <div style={{width: 46, height: 46, borderRadius: 23, background: K.morado, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${check})`}}>
                    <Ico d={I.check} size={30} color={K.blanco} w={3} />
                  </div>
                  <Frase k={k} desde="Te compró." n={2} acentos={['compró']} style={{fontSize: 40, fontWeight: 700}} />
                </div>
              </div>
            </div>
          </div>
        </Abs>

        {/* Ruta de salida */}
        <svg width={1300} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
          <defs>
            <mask id="m1">
              <path d={RUTA} stroke="#fff" strokeWidth={30} fill="none" pathLength={1} strokeDasharray={`${ruta} 1`} />
            </mask>
          </defs>
          <path d={RUTA} stroke={K.morado} strokeWidth={12} strokeLinecap="round" fill="none" strokeDasharray="0.1 30" mask="url(#m1)" />
        </svg>
        {/* El cliente sale y se va */}
        {f >= pY - 2 && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 110,
              height: 110,
              marginLeft: -55,
              marginTop: -55,
              offsetPath: `path('${RUTA}')`,
              offsetDistance: `${sale * 100}%`,
              offsetRotate: '0deg',
              opacity: t01(f, pY - 2, 8),
            }}
          >
            <div style={{width: 110, height: 110, borderRadius: 55, background: K.morado, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 34px rgba(137,29,255,0.35)'}}>
              <Ico d={I.persona} size={60} color={K.blanco} />
            </div>
            <div style={{position: 'absolute', right: -14, bottom: -10, width: 48, height: 48, borderRadius: 24, background: K.blanco, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: sombra}}>
              <Ico d={I.bolsa} size={28} />
            </div>
          </div>
        )}
      </Camara>

      {/* «Y nunca volvió.» en pantalla, abajo a la izquierda junto a la ruta */}
      <Abs x={100} y={1420}>
        <Frase k={k} desde="Y nunca" n={3} acentos={['nunca', 'volvió']} saltos={[1]} style={{fontSize: 118, fontWeight: 800, lineHeight: 1.0, color: K.tinta, letterSpacing: '-0.02em'}} />
      </Abs>
    </AbsoluteFill>
  );
};
