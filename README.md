# «¿Y la segunda compra?» — video vertical

## Versión 2 · motion graphics (`SegundaCompra-Motion`)

Estilo explicativo: el guion completo aparece palabra por palabra dentro de los dibujos (ticket, buscador, carril de clientes, celular, red de clientes y pista de compras). La cámara entra y sale de los elementos, cada escena tiene su propio fondo sutil y las transiciones se enciman (zoom, iris, barrido y subir). Incluye subtítulos, música y efectos UX/UI generados por código.

- Paleta Ambit One únicamente: `#891DFF`, `#212135`, `#E9EAF2`, `#FFFFFF`. Tipografía Gantari. Sin logo ni nombre de marca y siempre en contexto gastronómico.
- Código: `src/v2/` (`tiempos.ts` con el guion y los tiempos por palabra, `kit.tsx`, `escenas/E1–E5`, `Subtitulos.tsx`, `Video.tsx`).
- Sonido: `node scripts/eventos.mjs && python3 scripts/sonido.py` → `public/v2/sonido.wav`.
- Subtítulos .srt: `node scripts/srt.mjs` → `out/segunda-compra-motion.srt`.
- Render: `npx remotion render SegundaCompra-Motion out/segunda-compra-motion.mp4 --crf=17`. Después se normaliza a ≈ −14 LUFS con `ffmpeg -af loudnorm=I=-14:TP=-1.5`.
- Todavía no hay voz grabada: los tiempos de cada palabra se estiman en `tiempos.ts`. Cuando llegue la grabación, se sustituye `VOZ` por la alineación real y todo se reacomoda solo.

## Versión 1

Video de 35 s, 1080×1920, 30 fps, hecho en código con Remotion. Motion graphics propios con la estética Ambit: fondos lisos, piezas de interfaz que entran con desenfoque, morado como único acento y tipografía Gantari.

| Escena | Tiempo | Fondo | Qué pasa | Texto en pantalla |
|---|---|---|---|---|
| 1 · Gancho | 0–4 s | Gris claro → tinta | Ticket «Compra completada» y «¡Gracias, vuelvo pronto!». El ticket se convierte en puerta, el cliente sale hacia cámara y la puerta se cierra | NUNCA VOLVIÓ. |
| 2 · Dolor | 4–11 s | Blanco | Celular con anuncios y promociones. Después, clientes que entran, pagan y se van | BUSCAS CLIENTES NUEVOS… / PERO ¿QUÉ PASA CON LOS QUE YA TIENES? |
| 3 · Consecuencia | 11–19 s | Tinta + glow | Lista de tickets pagados. Después, lista de clientes sin teléfono ni correo y el botón «Enviar mensaje» deshabilitado | ¿A QUIÉN LE ESCRIBIRÍAS? |
| 4 · Revelación | 19–27 s | Blanco → lavanda | Tienda al centro conectada con sus clientes. Las conexiones se cortan una por una y el contador baja a 0 | NO PIERDAS EL CONTACTO. |
| 5 · Open loop | 27–35 s | Blanco | «1.ª compra ✓» y «2.ª compra ?» con borde punteado. Al final aparece la pregunta letra por letra | ¿Y LA SEGUNDA COMPRA? |

## Uso

```bash
npm install
npm run studio          # previsualizar
npm run render          # → out/segunda-compra.mp4
```

Cada escena también tiene su propia composición (`SegundaCompra-Escena1` … `Escena5`).

- Los tiempos están en `src/tiempos.ts`, y los tiempos internos al inicio de cada archivo de `src/escenas/`. Todavía no hay voz grabada, así que cada constante indica qué frase debe tocar. Cuando exista la voz, se ajustan esos valores y se agrega con `<Audio>` en `src/Video.tsx`.
- En un entorno sin descarga de Chrome se puede usar un Chromium local con `REMOTION_BROWSER=/ruta/al/chrome-headless-shell`.
