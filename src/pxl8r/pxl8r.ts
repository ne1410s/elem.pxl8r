import { CustomElementBase } from '@ne1410s/cust-elems';

import markupUrl from './pxl8r.html';
import stylesUrl from './pxl8r.css';
import { RgbaFilter, GreyscaleFilter } from '../filter/models';

export class Pxl8r extends CustomElementBase {

  public static readonly observedAttributes = ['src', 'contrast', 'x'];
  private static readonly DEF_X = 30;
  private static readonly DEF_CONTRAST = 50;

  private readonly _reader = new FileReader();
  private readonly _original = new Image();

  private readonly _elemCanvas: HTMLCanvasElement;
  private readonly _context: CanvasRenderingContext2D;

  private readonly _elemContrast: HTMLInputElement;
  private readonly _elemX: HTMLInputElement;
  private readonly _elemPicker: HTMLInputElement;

  public set src(value: string) {
    if (value) this.setAttribute('src', value);
    else this.removeAttribute('src');
  }

  public set contrast(value: number) { this.setAttribute('x', `${Math.max(0, Math.min(value, 100))}`); }
  public get contrast(): number { return parseInt(this._elemContrast.value); }

  public set x(value: number) { this.setAttribute('x', `${value}`); }
  public get x(): number { return parseInt(this._elemX.value); }

  constructor() {
    super(stylesUrl, markupUrl);

    this._elemCanvas = this.root.querySelector('#canvas');
    this._context = this._elemCanvas.getContext('2d');
    this._context.imageSmoothingEnabled = false;

    this._elemContrast = this.root.querySelector('#contrast');
    this._elemContrast.value = `${Pxl8r.DEF_CONTRAST}`;
    this._elemX = this.root.querySelector('#pixels-x');
    this._elemX.value = `${Pxl8r.DEF_X}`;
    this._elemPicker = this.root.querySelector('#filepicker');
    
    this._original.addEventListener('load', () => this.onImageLoad());
    this._reader.addEventListener('load', e => this._original.src = e.target.result as string);
    this._elemPicker.addEventListener('change', () => {
      const file = this._elemPicker.files[0];
      if (file) {
        this._reader.readAsDataURL(file);
        this.removeAttribute('src');
        this._elemPicker.value = null;
      }
    });
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'src':
        this._elemPicker.value = null;
        this._original.src = newValue;
        break;
      case 'contrast':
        this._elemContrast.value = newValue;
        break;
      case 'x':
        this._elemX.value = newValue;
        break;
    }
  }

  connectedCallback() {
    //..
  }

  private onImageLoad() {
    const aspect = this._original.width / this._original.height;
    const y = Math.round(this.x / aspect);
    const sizedData = this.getSizedData(this.x, y);
    this.applyFilter(sizedData, GreyscaleFilter);
    this._context.clearRect(0, 0, this.x, y);
    this._context.putImageData(sizedData, 0, 0);
  }

  private getSizedData(x: number, y: number): ImageData {
    this._elemCanvas.width = x;
    this._elemCanvas.height = y;
    this._context.drawImage(this._original, 0, 0, x, y);
    return this._context.getImageData(0, 0, x, y);
  }

  private applyFilter(arr: ImageData, filter: RgbaFilter): void {
    for (let i = 3; i < arr.data.length; i += 4) {
      const rgba = arr.data.slice(i - 3, i + 1);
      filter(rgba);
      arr.data[i - 3] = rgba[0];
      arr.data[i - 2] = rgba[1];
      arr.data[i - 1] = rgba[2];
      arr.data[i] = rgba[3];
    }
  }

  /** Emits a new event. */
  private fire<T>(event: string, detail?: T) {
    this.dispatchEvent(new CustomEvent(event, { detail }));
  }

  private debounce<T>(func: (arg: T) => void, delay = 200): (arg: T) => void {
    let timeout: NodeJS.Timeout;
    return function (arg) {
      clearTimeout(timeout);
      const that = this;
      timeout = setTimeout(() => func.call(that, arg), delay);
    };
  }

  private range(val: string|number, def: number, to: number, min: number, max: number): number {
    val = parseInt(`${val}`)
    const rnd = to * Math.round((isNaN(val) ? def : val) / to);
    return Math.max(min, Math.min(max, rnd));
  }
}
