import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, EASE, FONT} from '../tema';
import {Circulo, FondoTinta, IcoMensaje, IcoPersona, IcoTel, IcoTicket, Pieza, TextoEntra, prog} from '../base';

// «Ya conocen tu negocio, ya confiaron en ti. Pero si mañana quisieras invitarlos a regresar… ¿a quién le escribirías?»
const T = {
  tickets: 0, // «Ya conocen tu negocio, ya confiaron en ti»
  saleTickets: 96,
  lista: 104, // «Pero si mañana quisieras invitarlos a regresar…»
  boton: 150,
  texto: 156, // «¿a quién le escribirías?»
  sale: 232,
};

const tickets = [
  ['#1042', '$180.00', '09:14'],
  ['#1043', '$95.00', '09:31'],
  ['#1044', '$240.00', '10:02'],
  ['#1045', '$130.00', '10:47'],
  ['#1046', '$310.00', '11:20'],
  ['#1047', '$75.00', '12:05'],
  ['#1048', '$162.00', '12:38'],
  ['#1049', '$220.00', '13:12'],
];

const Feed: React.FC = () => {
  const f = useCurrentFrame();
  const sube = interpolate(f, [0, 110], [0, -520], {extrapolateRight: 'clamp'});
  return (
    <div style={{position: 'absolute', left: 150, top: 520, width: 780, transform: `translateY(${sube}px)`}}>
      {tickets.map(([n, m, h], i) => (
        <Pieza key={n} en={i * 9} dy={60}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 26,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 20,
              padding: '26px 30px',
              marginBottom: 22,
              fontFamily: FONT,
            }}
          >
            <Circulo size={76} bg="rgba(137,29,255,0.22)">
              <IcoTicket size={40} color="#C9A6FF" />
            </Circulo>
            <div style={{flex: 1}}>
              <div style={{fontSize: 34, fontWeight: 700, color: C.blanco}}>Ticket {n}</div>
              <div style={{fontSize: 26, fontWeight: 600, color: 'rgba(255,255,255,0.55)'}}>Pagado · {h}</div>
            </div>
            <div style={{fontSize: 38, fontWeight: 800, color: C.blanco}}>{m}</div>
          </div>
        </Pieza>
      ))}
    </div>
  );
};

const Fila: React.FC<{nombre: string; en: number}> = ({nombre, en}) => (
  <Pieza en={en} dy={18}>
    <div style={{display: 'flex', alignItems: 'center', gap: 22, padding: '22px 0', borderBottom: `2px solid ${C.grisUI2}`}}>
      <Circulo size={66} bg={C.grisUI}>
        <IcoPersona size={36} color="#A9A9B8" />
      </Circulo>
      <div style={{flex: 1, fontSize: 32, fontWeight: 700, color: C.tinta}}>{nombre}</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, color: '#B5B5C3', fontSize: 30, fontWeight: 700}}>
        <IcoTel size={30} color="#B5B5C3" />—
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, color: '#B5B5C3', fontSize: 30, fontWeight: 700, marginLeft: 18}}>
        <IcoMensaje size={30} color="#B5B5C3" />—
      </div>
    </div>
  </Pieza>
);

const Lista: React.FC = () => {
  const f = useCurrentFrame();
  const empuje = interpolate(f, [T.lista, 240], [1, 1.06], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE});
  const btn = prog(f, T.boton, 14);
  return (
    <div style={{position: 'absolute', left: 150, top: 300, width: 780, transform: `scale(${empuje})`, transformOrigin: '50% 40%'}}>
      <Pieza en={T.lista} dy={50}>
        <div style={{background: C.blanco, borderRadius: 24, padding: '40px 40px 36px', fontFamily: FONT, boxShadow: '0 30px 70px rgba(0,0,0,0.35)'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <div style={{fontSize: 46, fontWeight: 800, color: C.tinta}}>Clientes</div>
            <div style={{fontSize: 28, fontWeight: 600, color: C.grisTexto}}>128 este mes</div>
          </div>
          <div style={{marginTop: 14}}>
            {['Cliente #1042', 'Cliente #1043', 'Cliente #1044', 'Cliente #1045', 'Cliente #1046'].map((n, i) => (
              <Fila key={n} nombre={n} en={T.lista + 10 + i * 4} />
            ))}
          </div>
          <div
            style={{
              marginTop: 30,
              borderRadius: 18,
              padding: '24px 0',
              textAlign: 'center',
              fontSize: 32,
              fontWeight: 800,
              opacity: btn,
              transform: `scale(${0.94 + 0.06 * btn})`,
              background: C.grisUI2,
              color: '#B5B5C3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
            }}
          >
            <IcoMensaje size={34} color="#B5B5C3" /> Enviar mensaje
          </div>
        </div>
      </Pieza>
    </div>
  );
};

export const E3Consecuencia: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <FondoTinta />
      {f < T.saleTickets + 12 && (
        <Pieza en={0} sale={T.saleTickets} dy={0} style={{position: 'absolute', inset: 0}}>
          <Feed />
        </Pieza>
      )}
      {f >= T.lista && (
        <Pieza en={T.lista} sale={T.sale} dy={0} style={{position: 'absolute', inset: 0}}>
          <Lista />
        </Pieza>
      )}
      <div style={{position: 'absolute', left: 150, top: 1420}}>
        <TextoEntra lineas={['¿A QUIÉN LE', [{t: 'ESCRIBIRÍAS?', color: '#B98AFF'}]]} en={T.texto} sale={T.sale} size={96} color={C.blanco} alinear="left" />
      </div>
    </AbsoluteFill>
  );
};
