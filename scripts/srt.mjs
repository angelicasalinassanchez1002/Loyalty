// Genera out/segunda-compra-motion.srt con las mismas frases que los subtítulos quemados.
import {FRASES as frases} from '../src/v2/tiempos.ts';
import {mkdirSync, writeFileSync} from 'node:fs';
const ts = (x) => {
  const ms = Math.round(x * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`;
};
const srt = frases.map((p, i) => `${i + 1}\n${ts(p.s - 0.07)} --> ${ts(p.e)}\n${p.texto}\n`).join('\n');
mkdirSync('out', {recursive: true});
writeFileSync('out/segunda-compra-motion.srt', srt);
console.log(srt.split('\n\n').length, 'subtítulos');
