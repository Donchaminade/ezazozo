export const braiseImage = (name: string, small: boolean) =>
  `/images/braise/${name}${small ? '-sm' : ''}.webp`;

export interface GarnishPiece {
  name: string;
  /** Landing spot relative to the plate centre, in dish widths. */
  x: number;
  y: number;
  /** Sprite width, in dish widths. */
  size: number;
  rotate: number;
  /** Drawn above the fish (front of the plate) or under it. */
  front: boolean;
  mobile: boolean;
}

export const GARNISH: GarnishPiece[] = [
  { name: 'parsley-1', x: -0.05, y: -0.16, size: 0.17, rotate: -18, front: false, mobile: true },
  { name: 'onion-1', x: 0.22, y: -0.15, size: 0.14, rotate: 12, front: false, mobile: true },
  { name: 'chili-half', x: -0.29, y: -0.12, size: 0.15, rotate: -32, front: false, mobile: false },
  { name: 'alloco-3', x: 0.37, y: -0.04, size: 0.115, rotate: 14, front: false, mobile: false },
  { name: 'alloco-1', x: -0.31, y: 0.11, size: 0.13, rotate: -8, front: true, mobile: true },
  { name: 'alloco-2', x: -0.19, y: 0.19, size: 0.125, rotate: 16, front: true, mobile: true },
  { name: 'alloco-4', x: -0.39, y: 0.01, size: 0.115, rotate: 30, front: true, mobile: false },
  { name: 'tomato', x: 0.01, y: 0.2, size: 0.12, rotate: 0, front: true, mobile: true },
  { name: 'onion-2', x: 0.17, y: 0.2, size: 0.13, rotate: -14, front: true, mobile: false },
  { name: 'lime', x: 0.35, y: 0.12, size: 0.15, rotate: -20, front: true, mobile: true },
  { name: 'chili', x: 0.29, y: 0.0, size: 0.12, rotate: 58, front: true, mobile: true },
  { name: 'parsley-2', x: -0.07, y: 0.25, size: 0.13, rotate: 20, front: true, mobile: false },
];

export interface Chapter {
  label: string;
  /** Timeline position (in scroll units) where the chapter starts. */
  start: number;
}

export const TIMELINE_LENGTH = 360;

export const CHAPTERS: Chapter[] = [
  { label: 'La braise', start: 0 },
  { label: 'Le retournement', start: 110 },
  { label: 'Le dressage', start: 195 },
  { label: 'À votre table', start: 292 },
];
