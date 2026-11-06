import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {Abs, Bokeh, EXPO, FONT, FondoCuadricula, Frase, I, Ico, K, Reflejo, keys, sombraFuerte, t01} from '../kit';
import {P} from '../tiempos';

// «Ya conocen tu negocio, ya confiaron en ti. Pero si mañana quisieras invitarlos a regresar… ¿a quién le escribirías?»
const k = 2;

const TICKETS = ['Tacos al pastor ×3', 'Café americano', 'Hamburguesa doble', 'Helado de vainilla', 'Pizza familiar', 'Agua de horchata', 'Ramen tonkotsu'];

export const E3: React.FC = () => {
  const f = useCurrentFrame();
  const pPero = P(k, 'Pero si');
  const pA = P(k, 'a quién');
  const salePila = t01(f, pPero - 2, 22);
  const tel = keys(f, [[pPero - 4, 1500], [pPero + 22, 0]]);

  return (
    <AbsoluteFill>
      <FondoCuadricula />
      <Bokeh semilla="e3" n={4} opacidad={0.1} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 900, background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(137,29,255,0.35), rgba(137,29,255,0))'}} />

      {/* Título 1 */}
      <Abs x={90} y={230}>
        <Frase k={k} desde="Ya conocen" n={8} acentos={['confiaron']} resalte={false} saltos={[4]} sale={pPero - 4} style={{fontSize: 78, fontWeight: 700, color: K.blanco, lineHeight: 1.08}} />
      </Abs>

      {/* Pila de tickets que caen */}
      <div style={{position: 'absolute', inset: 0, opacity: 1 - salePila, transform: `translateY(${salePila * 300}px) scale(${1 - salePila * 0.15})`}}>
        {TICKETS.map((t, i) => {
          const a = 4 + i * 9;
          const c = t01(f, a, 22, EXPO);
          const rot = (random(`r${i}`) - 0.5) * 14;
          const dx = (random(`x${i}`) - 0.5) * 120;
          const y = interpolate(c, [0, 1], [-300, 1180 - i * 70]);
          return (
            <div key={t} style={{position: 'absolute', left: 540 - 300 + dx, top: y, width: 600, transform: `perspective(1600px) rotate(${rot * c + (1 - c) * 30}deg) rotateX(${(1 - c) * 70}deg) rotateY(${(1 - c) * (i % 2 ? 40 : -40)}deg)`, opacity: Math.min(1, c * 3), filter: `blur(${(1 - c) * 14 + (i < TICKETS.length - 3 ? 1.5 : 0)}px) brightness(${0.7 + 0.3 * (i / TICKETS.length)})`}}>
              <div style={{background: K.blanco, borderRadius: 22, padding: '26px 32px', display: 'flex', alignItems: 'center', gap: 22, boxShadow: sombraFuerte, fontFamily: FONT}}>
                <div style={{width: 74, height: 74, borderRadius: 20, background: 'rgba(137,29,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Ico d={I.ticket} size={42} />
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontSize: 38, fontWeight: 700, color: K.tinta}}>{t}</div>
                  <div style={{fontSize: 28, fontWeight: 600, color: K.suave}}>Pagado · Mesa {i + 2}</div>
                </div>
                <Ico d={I.check} size={44} w={3} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Título 2 */}
      <Abs x={90} y={190}>
        <Frase k={k} desde="Pero si" n={6} acentos={['regresar…']} resalte={false} saltos={[3]} style={{fontSize: 78, fontWeight: 700, color: K.blanco, lineHeight: 1.08}} />
      </Abs>

      {/* Celular: nuevo mensaje sin destinatarios */}
      <div style={{position: 'absolute', left: 140, top: 600, width: 800, height: 900, borderRadius: '50%', background: K.morado, opacity: 0.35 * t01(f, pPero + 10, 30), filter: 'blur(120px)'}} />
      <div style={{position: 'absolute', left: 120, top: 520, transform: `perspective(2200px) translateY(${tel}px) rotateX(${(tel / 1500) * 38}deg) rotateZ(${(tel / 1500) * -6}deg)`, transformOrigin: '50% 0%'}}>
        <div style={{width: 840, height: 1560, borderRadius: 90, background: K.tinta, padding: 20, boxSizing: 'border-box', boxShadow: sombraFuerte}}>
          <div style={{width: '100%', height: '100%', borderRadius: 72, background: K.blanco, overflow: 'hidden', fontFamily: FONT, position: 'relative', padding: '110px 50px 0', boxSizing: 'border-box'}}>
            <div style={{position: 'absolute', top: 30, left: '50%', width: 200, height: 46, marginLeft: -100, borderRadius: 23, background: K.tinta}} />
            <Reflejo en={pPero + 14} dur={34} fuerza={0.7} />
            <div style={{fontSize: 52, fontWeight: 800, color: K.tinta}}>Nuevo mensaje</div>
            <div style={{marginTop: 30, borderRadius: 26, background: K.niebla, padding: '26px 30px', minHeight: 150}}>
              <div style={{fontSize: 34, fontWeight: 700, color: K.suave, marginBottom: 6}}>Para:</div>
              <div style={{display: 'flex', alignItems: 'flex-end'}}>
                <Frase k={k} desde="a quién" n={4} acentos={['escribirías?']} style={{fontSize: 58, fontWeight: 800, color: K.tinta, lineHeight: 1.05}} />
                <div style={{width: 5, height: 58, marginLeft: 8, marginBottom: 8, background: K.morado, opacity: Math.floor(f / 8) % 2 ? 1 : 0.15}} />
              </div>
            </div>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 22, marginTop: 26, opacity: t01(f, pA + 10 + i * 4, 12)}}>
                <div style={{width: 84, height: 84, borderRadius: 42, border: `4px dashed ${K.tenue}`, boxSizing: 'border-box'}} />
                <div style={{flex: 1}}>
                  <div style={{width: 300 - i * 40, height: 24, borderRadius: 12, background: K.niebla}} />
                  <div style={{width: 200, height: 20, borderRadius: 10, background: K.niebla, marginTop: 12}} />
                </div>
                <div style={{fontSize: 30, fontWeight: 700, color: K.tenue}}>sin contacto</div>
              </div>
            ))}
            <div style={{position: 'absolute', left: 50, right: 50, bottom: 340, borderRadius: 30, background: K.morado, color: K.blanco, padding: '32px 36px', fontSize: 40, fontWeight: 600, lineHeight: 1.25}}>
              ¡Te extrañamos! Esta semana tu postre va por nuestra cuenta.
            </div>
            <div style={{position: 'absolute', left: 50, right: 50, bottom: 200, borderRadius: 999, background: K.niebla, color: K.tenue, padding: '30px 0', fontSize: 40, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16}}>
              <Ico d={I.enviar} size={42} color={K.tenue} /> Enviar
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
