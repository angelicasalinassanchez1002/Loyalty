import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, EASE, FONT} from '../tema';
import {Circulo, FondoBlanco, IcoMegafono, IcoPersona, IcoTienda, Pieza, TextoEntra, prog, sombra} from '../base';

// «Y mientras sigues buscando clientes nuevos, los que ya te compraron se van sin que sepas quiénes son.»
const T = {
  celular: 0,
  texto1: 14, // «buscando clientes nuevos»
  saleCel: 96,
  tienda: 104, // «los que ya te compraron…»
  texto2: 118, // «…se van sin que sepas quiénes son»
  saleTexto1: 92,
  saleTexto2: 200,
};

const Fila: React.FC<{titulo: string; dato: string; en: number}> = ({titulo, dato, en}) => (
  <Pieza en={en} dy={20}>
    <div style={{background: C.grisUI2, borderRadius: 18, padding: '24px 26px', display: 'flex', alignItems: 'center', gap: 20, marginBottom: 18}}>
      <Circulo size={64}>
        <IcoMegafono size={34} />
      </Circulo>
      <div style={{flex: 1}}>
        <div style={{fontSize: 30, fontWeight: 700, color: C.tinta}}>{titulo}</div>
        <div style={{fontSize: 24, fontWeight: 600, color: C.grisTexto, marginTop: 2}}>{dato}</div>
      </div>
    </div>
  </Pieza>
);

const Celular: React.FC = () => {
  const f = useCurrentFrame();
  const scroll = interpolate(f, [30, 96], [0, -90], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE});
  return (
    <div
      style={{
        width: 560,
        height: 1000,
        borderRadius: 64,
        background: '#15151F',
        padding: 16,
        boxShadow: '0 30px 60px rgba(32,32,53,0.25)',
      }}
    >
      <div style={{width: '100%', height: '100%', borderRadius: 50, background: C.blanco, overflow: 'hidden', fontFamily: FONT, position: 'relative'}}>
        <div style={{position: 'absolute', top: 18, left: '50%', width: 150, height: 36, marginLeft: -75, borderRadius: 18, background: '#15151F'}} />
        <div style={{padding: '96px 34px 0', transform: `translateY(${scroll}px)`}}>
          <div style={{fontSize: 26, fontWeight: 600, color: C.grisTexto}}>Marketing</div>
          <div style={{fontSize: 46, fontWeight: 800, color: C.tinta, marginBottom: 28}}>Anuncios</div>
          <Fila en={10} titulo="2x1 en cafés" dato="Alcance · 12.4 k personas" />
          <Fila en={14} titulo="Promo de martes" dato="Clientes nuevos · +38" />
          <Fila en={18} titulo="Descuento en redes" dato="Clics · 2,140" />
          <Fila en={22} titulo="Volantes digitales" dato="Alcance · 5.8 k personas" />
          <Fila en={26} titulo="Cupón de bienvenida" dato="Clientes nuevos · +21" />
          <Pieza en={30} dy={20}>
            <div style={{marginTop: 10, background: C.morado, color: C.blanco, borderRadius: 18, padding: '26px 0', textAlign: 'center', fontSize: 32, fontWeight: 800}}>
              + Crear anuncio
            </div>
          </Pieza>
        </div>
      </div>
    </div>
  );
};

// Clientes que entran, compran y se van.
const Flujo: React.FC = () => {
  const f = useCurrentFrame();
  const n = 6;
  return (
    <div style={{position: 'absolute', left: 0, top: 560, width: 1080, height: 420}}>
      <Pieza en={T.tienda} style={{position: 'absolute', left: 540 - 110, top: 100}}>
        <Circulo size={220} bg={C.blanco} style={{boxShadow: '0 0 80px rgba(137,29,255,0.25), ' + sombra}}>
          <IcoTienda size={120} stroke={1.6} />
        </Circulo>
      </Pieza>
      {Array.from({length: n}).map((_, i) => {
        const a = T.tienda + 8 + i * 13;
        // entra desde la izquierda, se detiene en la tienda, sale por la derecha
        const ent = prog(f, a, 14);
        const sal = prog(f, a + 22, 16, EASE);
        const x = interpolate(ent, [0, 1], [-160, 300]) + sal * 640;
        const vel = Math.abs(prog(f, a, 6) - prog(f, a - 1, 6)) + Math.abs(prog(f, a + 22, 6) - prog(f, a + 21, 6));
        const op = ent * (1 - prog(f, a + 30, 8));
        const ticket = prog(f, a + 12, 8) * (1 - prog(f, a + 24, 6));
        const y = 160 + (i % 2 === 0 ? -10 : 10);
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, opacity: op, filter: `blur(${Math.min(16, vel * 60)}px)`}}>
            <Circulo size={100} bg={i % 3 === 0 ? C.morado : '#F1E6FF'}>
              <IcoPersona size={56} color={i % 3 === 0 ? C.blanco : C.morado} />
            </Circulo>
            <div
              style={{
                position: 'absolute',
                left: 110,
                top: -70,
                opacity: ticket,
                transform: `translateY(${(1 - ticket) * 14}px)`,
                background: C.blanco,
                borderRadius: 12,
                padding: '8px 16px',
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 28,
                color: C.tinta,
                boxShadow: sombra,
                whiteSpace: 'nowrap',
              }}
            >
              ${[180, 95, 240, 130, 310, 75][i]}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const E2Dolor: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <FondoBlanco />
      {f < T.saleCel + 12 && (
        <Pieza en={T.celular} sale={T.saleCel} dy={80} style={{position: 'absolute', left: 260, top: 170}}>
          <Celular />
        </Pieza>
      )}
      <div style={{position: 'absolute', left: 150, top: 1290}}>
        <TextoEntra lineas={['BUSCAS CLIENTES', 'NUEVOS…']} en={T.texto1} sale={T.saleTexto1} size={84} alinear="left" />
      </div>
      {f >= T.tienda - 2 && <Flujo />}
      <div style={{position: 'absolute', left: 150, top: 1240}}>
        <TextoEntra
          lineas={['PERO ¿QUÉ PASA', 'CON LOS QUE', [{t: 'YA TIENES?', color: C.morado}]]}
          en={T.texto2}
          sale={T.saleTexto2}
          size={84}
          alinear="left"
        />
      </div>
    </AbsoluteFill>
  );
};
