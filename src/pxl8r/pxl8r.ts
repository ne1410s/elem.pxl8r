import { CustomElementBase } from '@ne1410s/cust-elems';

import markupUrl from './pxl8r.html';
import stylesUrl from './pxl8r.css';
import { RgbaFilter, MonochromeFilter, GreyscaleFilter } from '../filter/models';

export class Pxl8r extends CustomElementBase {

  public static readonly observedAttributes = ['src', 'filter', 'resolution'];

  private readonly _reader = new FileReader();
  private readonly _original = new Image();
  private _dimensionData: ImageData;
  private _workingData: ImageData;

  private readonly _elemCanvas: HTMLCanvasElement;
  private readonly _context: CanvasRenderingContext2D;
  private readonly _ctrlForm: HTMLFormElement;

  private get _configFilter(): RgbaFilter {
    switch (this.filter) {
      case 'bw': return new MonochromeFilter(255 - this._ctrlForm.threshold.value);
      case 'gs': return new GreyscaleFilter(this._ctrlForm.shades.value);
    }
  }

  public set src(value: string) {
    if (value) this.setAttribute('src', value);
    else this.removeAttribute('src');
  }

  public get filter(): 'bw' | 'gs' { return this._ctrlForm.filter.value; }
  public set filter(value: 'bw' | 'gs') { this.setAttribute('filter', value); }

  public get resolution(): number { return this._ctrlForm.resolution.value; }
  public set resolution(value: number) { this.setAttribute('resolution', `${value}`); }

  constructor() {
    super(stylesUrl, markupUrl);

    this._elemCanvas = this.root.querySelector('#canvas');
    this._context = this._elemCanvas.getContext('2d');
    this._context.imageSmoothingEnabled = false;

    this._original.addEventListener('load', () => this.onImageLoad());
    this._reader.addEventListener('load', e => this._original.src = e.target.result as string);

    this._ctrlForm = this.root.querySelector('#control-panel');
    this._ctrlForm.querySelectorAll('label.filter').forEach(fCtrl => {
      fCtrl.addEventListener('input', () => this.onFilterChange());
    });

    this._ctrlForm.resolution.addEventListener('input', () => this.onDimsChange());
    
    const elemPicker = this._ctrlForm.filepicker as HTMLInputElement;
    elemPicker.addEventListener('change', () => {
      const file = elemPicker.files[0];
      if (file) {
        this._reader.readAsDataURL(file);
        this.removeAttribute('src');
        elemPicker.value = null;
      }
    });

    const elemFilter = this._ctrlForm.filter as HTMLSelectElement;
    elemFilter.addEventListener('change', e => {
      const val = this._ctrlForm.filter.value;
      if (!val) this._ctrlForm.removeAttribute('data-filter');
      else this._ctrlForm.setAttribute('data-filter', val);   
      this.onFilterChange();
    });
    this.fire('change', elemFilter);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      case 'src':
        this._ctrlForm.filepicker.value = null;
        this._original.src = newValue;
        break;
      case 'filter':
        this._ctrlForm.filter.value = newValue;
        break;
      case 'resolution':
        const val = parseInt(newValue) || 50;
        this._ctrlForm.resolution.value = `${Math.max(0, Math.min(val, 100))}`;
        break;
    }
  }

  connectedCallback() {
    //...
  }

  private onImageLoad() {
    this.onDimsChange();
  }

  private onDimsChange() {
    if (this._original.src) {
      const aspect = this._original.width / this._original.height;
      const x = this._elemCanvas.width = this.resolution;
      const y = this._elemCanvas.height = Math.ceil(x / aspect);

      this._context.drawImage(this._original, 0, 0, x, y);
      this._dimensionData = this._context.getImageData(0, 0, x, y);
      this.onFilterChange();
    }
  }

  private onFilterChange() {
    if (this._dimensionData) {

      this._workingData = new ImageData(
        this._dimensionData.data.slice(),
        this._dimensionData.width,
        this._dimensionData.height);

      this.applyFilter(this._workingData);
      this.onPaintPixels();
    }
  }

  private applyFilter(arr: ImageData): void {
    const filter = this._configFilter;
    for (let i = 3; i < arr.data.length; i += 4) {
      const rgba = arr.data.slice(i - 3, i + 1);
      filter.apply(rgba);
      arr.data[i - 3] = rgba[0];
      arr.data[i - 2] = rgba[1];
      arr.data[i - 1] = rgba[2];
      arr.data[i] = rgba[3];
    }
  }

  private onPaintPixels() {
    this._context.putImageData(this._workingData, 0, 0);
  }

  /** Emits a new event. */
  private fire<T>(event: string, target?: EventTarget, detail?: T) {
    (target || this).dispatchEvent(new CustomEvent(event, { detail }));
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
