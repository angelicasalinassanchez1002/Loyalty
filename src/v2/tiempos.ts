// Guion completo. Todavía sin grabación: los tiempos de cada palabra se estiman
// (peso por largo + pausas en puntuación) dentro de la ventana de cada escena.
// Cuando llegue la voz, se reemplaza VOZ por la alineación real {t, s, e}.
export const FPS = 30;
export const LEAD = 10;
export const SOLAPE = 16;

const GUION: {texto: string; desde: number; hasta: number}[] = [
  {texto: 'Le encantó tu negocio. Te compró. Y nunca volvió.', desde: 0.45, hasta: 3.7},
  {texto: 'Y mientras sigues buscando clientes nuevos, los que ya te compraron se van sin que sepas quiénes son.', desde: 4.4, hasta: 10.7},
  {texto: 'Ya conocen tu negocio, ya confiaron en ti. Pero si mañana quisieras invitarlos a regresar… ¿a quién le escribirías?', desde: 11.4, hasta: 18.7},
  {texto: 'Tal vez no necesitas empezar por atraer más clientes. Necesitas dejar de perder el contacto con los que ya tienes.', desde: 19.4, hasta: 26.7},
  {texto: 'Porque la primera compra ya la conseguiste. La pregunta es: ¿cómo haces para que haya una segunda?', desde: 27.4, hasta: 32.0},
];

export type Voz = {t: string; s: number; e: number; escena: number};

const pausa = (w: string): number => (/[.?…:]$/.test(w) ? 0.34 : /,$/.test(w) ? 0.16 : 0);

export const VOZ: Voz[] = GUION.flatMap((g, escena) => {
  const ws = g.texto.split(' ');
  const pesos = ws.map((w) => 0.16 + 0.05 * w.replace(/[^\p{L}]/gu, '').length);
  const pausas = ws.map((w, i) => (i < ws.length - 1 ? pausa(w) : 0));
  const total = pesos.reduce((a, b) => a + b, 0) + pausas.reduce((a, b) => a + b, 0);
  const k = (g.hasta - g.desde) / total;
  let t = g.desde;
  return ws.map((w, i) => {
    const s = t;
    const e = t + pesos[i] * k;
    t = e + pausas[i] * k;
    return {t: w, s, e, escena};
  });
});

// Inicio de cada escena (cuadro) = LEAD antes de su primera palabra; la 1 empieza en 0.
export const TOTAL = 35 * FPS;
export const INICIOS = GUION.map((_, k) => (k === 0 ? 0 : Math.round(VOZ.find((v) => v.escena === k)!.s * FPS) - LEAD));
export const FIN = (k: number) => (k + 1 < INICIOS.length ? INICIOS[k + 1] : TOTAL);

const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

/** Índice global de la primera palabra de `frase` dentro de la escena k. */
export const idx = (k: number, frase: string): number => {
  const objetivo = frase.split(' ').map(norm);
  for (let i = 0; i < VOZ.length; i++) {
    if (VOZ[i].escena !== k) continue;
    if (objetivo.every((o, j) => VOZ[i + j] && norm(VOZ[i + j].t) === o)) return i;
  }
  throw new Error(`No encuentro «${frase}» en la escena ${k + 1}`);
};

/** Cuadro (dentro de la escena k) en que se dice la palabra i. */
export const enEscena = (k: number, i: number) => Math.round(VOZ[i].s * FPS) - INICIOS[k];
/** Atajo: cuadro dentro de la escena k en que empieza `frase`. */
export const P = (k: number, frase: string) => enEscena(k, idx(k, frase));

/** Frases para subtítulos: se cortan en puntuación; si pasan de 7 palabras, se parten
 *  antes de una palabra de enlace cercana a la mitad. `e` = hasta que empieza la siguiente (máx. +0.6 s). */
const ENLACES = new Set(['se', 'con', 'sin', 'por', 'para', 'pero', 'y', 'que', 'a', 'de']);
export const FRASES: {texto: string; s: number; e: number}[] = (() => {
  const grupos: Voz[][] = [];
  let cur: Voz[] = [];
  VOZ.forEach((v, i) => {
    cur.push(v);
    if (/[.,?…:]$/.test(v.t) || i === VOZ.length - 1 || VOZ[i + 1].escena !== v.escena) {
      grupos.push(cur);
      cur = [];
    }
  });
  const partes = grupos.flatMap((g) => {
    if (g.length <= 7) return [g];
    let mejor = Math.floor(g.length / 2);
    let dist = Infinity;
    g.forEach((w, j) => {
      if (j >= 2 && j <= g.length - 2 && ENLACES.has(norm(w.t)) && Math.abs(j - g.length / 2) < dist) {
        dist = Math.abs(j - g.length / 2);
        mejor = j;
      }
    });
    return [g.slice(0, mejor), g.slice(mejor)];
  });
  const out = partes.map((p) => ({texto: p.map((w) => w.t).join(' '), s: p[0].s, e: p[p.length - 1].e}));
  return out.map((p, i) => ({...p, e: Math.min(out[i + 1]?.s ?? p.e + 0.6, p.e + 0.6)}));
})();
