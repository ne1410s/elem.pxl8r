import { CustomElementBase } from '@ne1410s/cust-elems';

import markupUrl from './pxl8r.html';
import stylesUrl from './pxl8r.css';

export class Pxl8r extends CustomElementBase {

  public static readonly observedAttributes = ['src', 'contrast', 'x', 'y'];

  private readonly _reader: FileReader = new FileReader();
  private readonly _elemContrast: HTMLInputElement;
  private readonly _elemPicker: HTMLInputElement;
  private readonly _elemCanvas: HTMLCanvasElement;
  private readonly _context: CanvasRenderingContext2D;

  public set src(value: string) {
    if (value) this.setAttribute('src', value);
    else this.removeAttribute('src');
  }

  public set x(value: number) { this.setAttribute('x', `${value}`); }
  public get x(): number { return parseInt(this.getAttribute('x')); }

  public set y(value: number) { this.setAttribute('y', `${value}`); }
  public get y(): number { return parseInt(this.getAttribute('y')); }

  constructor() {
    super(stylesUrl, markupUrl);

    this._elemContrast = this.root.querySelector('#contrast');
    this._elemPicker = this.root.querySelector('#filepicker');
    this._elemCanvas = this.root.querySelector('#canvas');
    this._context = this._elemCanvas.getContext('2d');
    this._context.imageSmoothingEnabled = false;
    
    this._reader.addEventListener('load', e => this.setNewImageSource(e.target.result as string));
    this._elemPicker.addEventListener('change', () => {
      const file = this._elemPicker.files[0];
      if (file) this._reader.readAsDataURL(file);
      this.src = null;
    });
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'src':
        this._elemPicker.value = null;
        this.setNewImageSource(newValue);
        break;
      case 'contrast':
        this._elemContrast.value = newValue;
        break;
    }
  }

  connectedCallback() {
    // on connected to dom
  }

  private setNewImageSource(src: string) {
    if (!src) {
      this._context.clearRect(0, 0, this._elemCanvas.width, this._elemCanvas.height);
    } else {
      const img = new Image();
      img.addEventListener('load', e => this.onImageLoad(e));
      img.src = src;
    }
  }

  private onImageLoad(event: Event) {
    const img = event.target as HTMLImageElement;
    const aspect = img.width / img.height;

    const targetW = this._elemCanvas.clientWidth;
    const targetH = targetW / aspect;
    
    this._elemCanvas.width = targetW;
    this._elemCanvas.height = targetH;
    this._context.drawImage(img, 0, 0, targetW, targetH);
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
