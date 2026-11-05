import '@fontsource/gantari/600.css';
import '@fontsource/gantari/700.css';
import '@fontsource/gantari/800.css';
import {Easing} from 'remotion';

export const FONT = "'Gantari', 'Inter', sans-serif";

export const C = {
  tinta: '#202035',
  glow: '#6573CB',
  morado: '#891DFF',
  moradoPastilla: '#6A1DC3',
  blanco: '#FFFFFF',
  grisUI: '#ECE9ED',
  grisUI2: '#F4F4F6',
  grisTexto: '#8A8A9A',
  lavanda: '#C9CCFF',
};

// Entrada rápida, asentamiento largo.
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const FPS = 30;
