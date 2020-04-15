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
- **pixels-x**: Sets the number of 

### Events
```javascript
const tooltip = document.querySelector('ne14-pxl8r');

tooltip.addEventListener('rendered', () => {
  console.log('Rendered');
});
```
- **rendered**: Fired on pixelation complete with the specified image and parameters
### Methods
- *There are no bespoke methods exposed by this element*
### Properties
- `set` **src** (string): Sets the attribute with the corresponding value
- **contrast** (number): Gets or sets the contrast 0 - 100
- **pixels-x** (number): Gets or sets the number of pixels to use in the x-dimension. The aspect ratio is preserved in y.
