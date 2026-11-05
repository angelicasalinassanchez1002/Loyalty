import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, EASE, EASE_IN, FONT} from '../tema';
import {Circulo, FondoClaro, FondoTinta, IcoCheck, IcoPersona, Pieza, TextoEntra, prog, sombra} from '../base';

// «Le encantó tu negocio. Te compró. Y nunca volvió.»
const T = {
  ticket: 4, // «Le encantó tu negocio»
  gracias: 26, // «Te compró»
  transforma: 40,
  sale: 52, // el cliente sale hacia cámara
  puerta: 70, // la puerta se cierra
  corte: 82, // «Y nunca volvió»
  texto: 84,
};

const lerp = (t: number, a: number, b: number) => a + (b - a) * t;

export const E1Gancho: React.FC = () => {
  const f = useCurrentFrame();
  const tr = prog(f, T.transforma, 16);
  // Caja: ticket 780x560 → marco de puerta 460x720
  const w = lerp(tr, 780, 460);
  const h = lerp(tr, 560, 720);
  const r = lerp(tr, 24, 30);
  const y = lerp(tr, 980, 960);

  const salida = prog(f, T.sale, 20, EASE_IN);
  const cierre = prog(f, T.puerta, 10, EASE_IN);
  const vel = interpolate(f, [T.puerta, T.puerta + 5, T.puerta + 10], [0, 16, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

  if (f >= T.corte) {
    return (
      <AbsoluteFill>
        <FondoTinta intensidad={0.6} />
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
          <TextoEntra lineas={['NUNCA VOLVIÓ.']} en={T.texto} sale={112} size={112} color={C.blanco} pasoPalabra={6} />
        </AbsoluteFill>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill>
      <FondoClaro />
      <Pieza en={T.ticket} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920}}>
        <div
          style={{
            position: 'absolute',
            left: 540 - w / 2,
            top: y - h / 2,
            width: w,
            height: h,
            borderRadius: r,
            background: C.blanco,
            boxShadow: sombra,
            overflow: 'hidden',
            fontFamily: FONT,
          }}
        >
          {/* Contenido del ticket */}
          <div style={{position: 'absolute', inset: 0, padding: 56, opacity: 1 - tr, filter: `blur(${tr * 10}px)`}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
              <Circulo size={104}>
                <IcoCheck size={56} stroke={2.4} />
              </Circulo>
              <div>
                <div style={{fontSize: 50, fontWeight: 800, color: C.tinta}}>Compra completada</div>
                <div style={{fontSize: 36, fontWeight: 600, color: C.grisTexto, marginTop: 4}}>Mesa 4 · 13:42</div>
              </div>
            </div>
            <div style={{height: 2, background: C.grisUI, margin: '44px 0 32px'}} />
            {[
              ['Café de olla', '$45.00'],
              ['Chilaquiles verdes', '$145.00'],
              ['Pan dulce', '$55.00'],
            ].map(([a, b]) => (
              <div key={a} style={{display: 'flex', justifyContent: 'space-between', fontSize: 38, fontWeight: 600, color: C.tinta, marginBottom: 18}}>
                <span>{a}</span>
                <span style={{color: C.grisTexto}}>{b}</span>
              </div>
            ))}
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 50, fontWeight: 800, color: C.tinta, marginTop: 30}}>
              <span>Total</span>
              <span style={{color: C.morado}}>$245.00</span>
            </div>
          </div>

          {/* Interior visto por la puerta */}
          <div
            style={{
              position: 'absolute',
              inset: 18,
              borderRadius: r - 10,
              opacity: tr,
              background: 'linear-gradient(180deg, #FFF6EA 0%, #F3E2C9 100%)',
              overflow: 'hidden',
            }}
          >
            <div style={{position: 'absolute', left: -40, right: -40, bottom: 0, height: 200, background: 'linear-gradient(180deg, #E8D3B4, #D9BF9A)'}} />
            {/* Puerta que se cierra (bisagra a la izquierda) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transformOrigin: 'left center',
                transform: `scaleX(${cierre})`,
                background: 'linear-gradient(180deg, #2A2A44 0%, #202035 100%)',
                filter: `blur(${vel * 0.4}px)`,
              }}
            >
              <div style={{position: 'absolute', right: 34, top: '50%', width: 14, height: 90, borderRadius: 7, background: '#4B4B6A', opacity: cierre}} />
            </div>
          </div>
        </div>
      </Pieza>

      {/* «¡Gracias!» */}
      <Pieza en={T.gracias} sale={T.transforma} style={{position: 'absolute', left: 150, top: 1310}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, background: C.blanco, borderRadius: 16, padding: '22px 34px', boxShadow: sombra, fontFamily: FONT, fontSize: 46, fontWeight: 700, color: C.tinta}}>
          <IcoPersona size={44} />
          ¡Gracias, vuelvo pronto!
        </div>
      </Pieza>

      {/* El cliente sale del establecimiento, hacia cámara */}
      {f >= T.transforma + 8 && (
        <div
          style={{
            position: 'absolute',
            left: 540 - 80,
            top: 1010 - 80,
            opacity: prog(f, T.transforma + 8, 12) * (1 - salida),
            transform: `translate(${salida * 160}px, ${salida * 260}px) scale(${1 + salida * 2.2})`,
            filter: `blur(${salida * 16}px)`,
          }}
        >
          <Circulo size={160} bg={C.morado}>
            <IcoPersona size={92} color={C.blanco} stroke={1.8} />
          </Circulo>
        </div>
      )}
    </AbsoluteFill>
  );
};
