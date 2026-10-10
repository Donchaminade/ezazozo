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

// Loosely mirrors the final plated photo (alloco on the left, lime top right, onion and chili
// at the bottom) so the crossfade between the assembled dish and the photo reads as one plate.
export const GARNISH: GarnishPiece[] = [
  { name: 'onion-1', x: -0.1, y: -0.19, size: 0.14, rotate: 12, front: false, mobile: true },
  { name: 'parsley-1', x: 0.12, y: -0.19, size: 0.17, rotate: -18, front: false, mobile: true },
  { name: 'lime', x: 0.31, y: -0.15, size: 0.15, rotate: -20, front: false, mobile: true },
  { name: 'chili-half', x: -0.29, y: -0.13, size: 0.15, rotate: -32, front: false, mobile: false },
  { name: 'alloco-3', x: -0.42, y: -0.03, size: 0.115, rotate: 14, front: false, mobile: false },
  { name: 'alloco-1', x: -0.31, y: 0.11, size: 0.13, rotate: -8, front: true, mobile: true },
  { name: 'alloco-2', x: -0.19, y: 0.19, size: 0.125, rotate: 16, front: true, mobile: true },
  { name: 'alloco-4', x: -0.39, y: 0.04, size: 0.115, rotate: 30, front: true, mobile: false },
  { name: 'tomato', x: 0.01, y: 0.2, size: 0.12, rotate: 0, front: true, mobile: true },
  { name: 'onion-2', x: 0.17, y: 0.2, size: 0.13, rotate: -14, front: true, mobile: false },
  { name: 'chili', x: 0.24, y: 0.19, size: 0.12, rotate: 40, front: true, mobile: true },
  { name: 'parsley-2', x: 0.36, y: 0.1, size: 0.13, rotate: 20, front: true, mobile: false },
];

export const TIMELINE_LENGTH = 360;
