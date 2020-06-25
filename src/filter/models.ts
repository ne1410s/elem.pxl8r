export interface RgbaFilter {
  apply: (rgba: Uint8ClampedArray) => void;
}

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

export class GreyscaleFilter implements RgbaFilter {
  private readonly brackets: number;

  constructor(shades: number = 16) {
    this.brackets = range(shades - 1, 16, 1, 1, 255);
  }

  apply = (rgba: Uint8ClampedArray) => {
    const mean = (rgba[0] + rgba[1] + rgba[2]) / 3;
    const bracketed = range(mean, 0, 255 / this.brackets, 0, 255);
    rgba[3] = 255;
    rgba[0] = rgba[1] = rgba[2] = bracketed;
  };
}

export class MonochromeFilter implements RgbaFilter {
  private static readonly HEX_REG = /^#(?<r>[0-9a-f]{2})(?<g>[0-9a-f]{2})(?<b>[0-9a-f]{2})$/i;
  private readonly shade: Rgba;

  constructor(
    private readonly threshold: number,
    private readonly inverted: boolean,
    shadeHex: string
  ) {
    const groups = MonochromeFilter.HEX_REG.exec(shadeHex).groups;
    this.shade = {
      r: parseInt(groups.r, 16),
      g: parseInt(groups.g, 16),
      b: parseInt(groups.b, 16),
      a: 255,
    };
  }

  apply = (rgba: Uint8ClampedArray) => {
    const gs = Math.round((rgba[0] + rgba[1] + rgba[2]) / 3);
    if ((this.inverted && gs >= this.threshold) || (!this.inverted && gs < this.threshold)) {
      rgba[0] = this.shade.r;
      rgba[1] = this.shade.g;
      rgba[2] = this.shade.b;
      rgba[3] = this.shade.a;
    } else {
      rgba[0] = rgba[1] = rgba[2] = rgba[3] = 255;
    }
  };
}

export function range(n: number, df: number, to: number, mn: number, mx: number): number {
  const rnd = to * Math.round((isNaN(n) ? df : n) / to);
  return Math.max(mn, Math.min(mx, rnd));
}
