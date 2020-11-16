# @ne1410s/pxl8r

## A custom element that facilitates image pixelation.

```html
<ne14-pxl8r></ne14-pxl8r>
```

- **Use:** `<script src="PATH_TO_UMD_SCRIPT"></script>`
- **Extend:** _npm i -S @ne1410s/pxl8r_

### Attributes

```html
<ne14-pxl8r src="..."></ne14-pxl8r>
```

- **src**: Sets a new image source
- **filter**: Sets the contrast 0 - 100
- **resolution**: Sets the number of pixels in the _x_ dimension. (The aspect ratio is preserved)

### Events

```javascript
const tooltip = document.querySelector('ne14-pxl8r');

tooltip.addEventListener('render', (event) => {
  console.log('Rendered data:', event.detail);
});
```

- **change**: Fired when a parameter changes
- **render**: Fired when a filtered data has been applied

### Methods

- _There are no bespoke methods exposed by this element_

### Properties

- `set` **src** (string): Sets the attribute with the corresponding value
- **contrast** (number): Gets or sets the contrast 0 - 100
- **x** (number): Gets or sets the number of pixels in the _x_ dimension. The aspect ratio is preserved for y, unless y is otherwise set
- **y** (number): Gets or sets the number of pixels in the _y_ dimension. The aspect ratio is preserved for x, unless x is otherwise set

### CSS Variables

- _There are no css variables exposed by this element_
