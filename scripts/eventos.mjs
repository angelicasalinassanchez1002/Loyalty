// Exporta los momentos de efectos de sonido (en segundos) a partir de los mismos tiempos del video.
import {INICIOS, P, VOZ, idx} from '../src/v2/tiempos.ts';
import {writeFileSync} from 'node:fs';
const A = (k, frase, d = 0) => (INICIOS[k] + P(k, frase) + d) / 30;
const palabras = (k, frase, n) => Array.from({length: n}, (_, j) => VOZ[idx(k, frase) + j].s);
const zoom5 = A(4, 'una segunda?', 22);
const titulo = zoom5 + 16 / 30;
const ev = {
  whoosh: [A(0, 'Y nunca', -6), ...INICIOS.slice(1).map((f) => f / 30), A(1, 'los que', -10), A(2, 'Pero si', -4), zoom5],
  tick: [...palabras(1, 'buscando', 3), ...palabras(2, 'a quién', 4), ...Array.from({length: 19}, (_, i) => titulo + (i * 2) / 30)],
  pop: [A(0, 'Te compró.', 2), A(1, 'buscando', 6), A(1, 'buscando', 12), A(1, 'buscando', 18), A(3, 'Necesitas dejar', 6), A(4, 'primera compra'), A(4, 'La pregunta', 14)],
  click: [A(3, 'perder el', 2), A(3, 'perder el', 8), A(3, 'perder el', 14), A(3, 'perder el', 20)],
  exito: [A(0, 'Te compró.', 2), A(3, 'con los', 4), A(4, 'conseguiste.', 4)],
  imprime: [0.0],
  riser: [zoom5 - 1.2],
  final: [titulo + 0.2],
  snap: [A(0, 'nunca', 20)],
  golpe: [4, 10, 16, 22].map((d) => A(1, 'buscando', d)),
  vidrio: [A(3, 'Necesitas dejar', 12)],
  lupa: [A(2, 'a quién', 10)],
  portal: [A(4, 'una segunda?', -8)],
  voz: VOZ.map((v) => [v.s, v.e]),
};
writeFileSync('scripts/eventos.json', JSON.stringify(ev, null, 1));
console.log('ok', Object.fromEntries(Object.entries(ev).map(([k, v]) => [k, v.length])));

