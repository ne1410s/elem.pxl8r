import { CustomElementBase } from '@ne1410s/cust-elems';

import markupUrl from './pxl8r.html';
import stylesUrl from './pxl8r.css';
import { RgbaFilter, MonochromeFilter } from '../filter/models';

export class Pxl8r extends CustomElementBase {

  public static readonly observedAttributes = ['src', 'contrast', 'x'];

  private readonly _reader = new FileReader();
  private readonly _original = new Image();
  private _dimensionData: ImageData;
  private _workingData: ImageData;

  private readonly _elemCanvas: HTMLCanvasElement;
  private readonly _context: CanvasRenderingContext2D;

  private readonly _elemBrightness: HTMLInputElement;
  private readonly _elemX: HTMLInputElement;
  private readonly _elemPicker: HTMLInputElement;

  public set src(value: string) {
    if (value) this.setAttribute('src', value);
    else this.removeAttribute('src');
  }

  public set brightness(value: number) { this.setAttribute('x', `${Math.max(0, Math.min(value, 100))}`); }
  public get brightness(): number { return parseInt(this._elemBrightness.value); }

  public set x(value: number) { this.setAttribute('x', `${value}`); }
  public get x(): number { return parseInt(this._elemX.value); }

  constructor() {
    super(stylesUrl, markupUrl);

    this._elemCanvas = this.root.querySelector('#canvas');
    this._context = this._elemCanvas.getContext('2d');
    this._context.imageSmoothingEnabled = false;

    this._elemBrightness = this.root.querySelector('#brightness');
    this._elemX = this.root.querySelector('#pixels-x');
    this._elemPicker = this.root.querySelector('#filepicker');
    
    this._original.addEventListener('load', () => this.onImageLoad());
    this._reader.addEventListener('load', e => this._original.src = e.target.result as string);
    this._elemBrightness.addEventListener('input', () => this.onFilterChange());
    this._elemX.addEventListener('input', () => this.onDimsChange());
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
        this._elemBrightness.value = newValue;
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
    this.onDimsChange();
  }

  private onDimsChange() {
    if (this._original) {
      const aspect = this._original.width / this._original.height;
      const x = this._elemCanvas.width = this.x;
      const y = this._elemCanvas.height = Math.ceil(x / aspect);

      this._context.drawImage(this._original, 0, 0, x, y);
      this._dimensionData = this._context.getImageData(0, 0, x, y);
      this.onFilterChange();
    }
  }

  private onFilterChange() {
    if (this._dimensionData) {
      //let filter = new GreyscaleFilter(8);
      let filter = new MonochromeFilter(255 - this.brightness);
      this._workingData = new ImageData(
        this._dimensionData.data.slice(),
        this._dimensionData.width,
        this._dimensionData.height);

      this.applyFilter(this._workingData, filter);
      this.onPixelate();
    }
  }

  private onPixelate() {
    this._context.putImageData(this._workingData, 0, 0);
  }

  private applyFilter(arr: ImageData, filter: RgbaFilter): void {
    for (let i = 3; i < arr.data.length; i += 4) {
      const rgba = arr.data.slice(i - 3, i + 1);
      filter.apply(rgba);
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
}
