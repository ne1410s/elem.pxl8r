# @ne1410s/pxl8r
## A custom element that facilitates image pixelation.
```html
<ne14-pxl8r></ne14-pxl8r>
```
- **Use:** `<script src="PATH_TO_UMD_SCRIPT"></script>`
- **Extend:** *npm i -S @ne1410s/pxl8r*
### Attributes
```html
<ne14-pxl8r src="..."></ne14-pxl8r>
```
- **src**: Sets a new image source
- **contrast**: Sets the contrast 0 - 100
- **x**: Sets the number of pixels in the *x* dimension
- **y**: Sets the number of pixels in the *y* dimension

### Events
```javascript
const tooltip = document.querySelector('ne14-pxl8r');

tooltip.addEventListener('render', () => {
  console.log('Rendered');
});
```
- **change**: Fired when a parameter changes
- **render**: Fired when pixelation occurs (e.g. after change in parameter(s))
### Methods
- *There are no bespoke methods exposed by this element*
### Properties
- `set` **src** (string): Sets the attribute with the corresponding value
- **contrast** (number): Gets or sets the contrast 0 - 100
- **x** (number): Gets or sets the number of pixels in the *x* dimension. The aspect ratio is preserved for y, unless y is otherwise set
- **y** (number): Gets or sets the number of pixels in the *y* dimension. The aspect ratio is preserved for x, unless x is otherwise set
