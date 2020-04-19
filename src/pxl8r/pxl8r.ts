import { CustomElementBase } from '@ne1410s/cust-elems';

import markupUrl from './pxl8r.html';
import stylesUrl from './pxl8r.css';

export class Pxl8r extends CustomElementBase {

  public static readonly observedAttributes = ['attrs!'];

  constructor() {
    super(stylesUrl, markupUrl);
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    switch (name) {
      // case '': break;
    }
  }

  connectedCallback() {
    // on connected to dom
  }

  disconnectedCallback() {
    // on disconnected from dom
  }
}
