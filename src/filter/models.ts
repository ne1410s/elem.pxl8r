export declare type RgbaFilter = (rgba: Uint8ClampedArray) => void;

export const GreyscaleFilter: RgbaFilter = (rgba: Uint8ClampedArray): void => {
  const gs = Math.round((rgba[0] + rgba[1] + rgba[2]) / 3);
  rgba[3] = 255;
  rgba[0] = rgba[1] = rgba[2] = gs;
}
