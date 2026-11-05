// Tiempos en segundos. Sin grabación de voz todavía: cada constante dice qué palabra debe tocar.
// Cuando exista la voz, ajustar estos valores a la narración.
export const s = (seg: number) => Math.round(seg * 30);

export const ESCENAS = {
  e1: {desde: 0, dura: 4}, // «Le encantó tu negocio. Te compró. Y nunca volvió.»
  e2: {desde: 4, dura: 7}, // «Y mientras sigues buscando clientes nuevos…»
  e3: {desde: 11, dura: 8}, // «Ya conocen tu negocio… ¿a quién le escribirías?»
  e4: {desde: 19, dura: 8}, // «Tal vez no necesitas empezar por atraer más clientes…»
  e5: {desde: 27, dura: 8}, // «Porque la primera compra ya la conseguiste…»
};
export const TOTAL = 35;
