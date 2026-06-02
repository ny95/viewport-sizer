# Viewport Sizer

Simple plugin for auto resizing the browser viewport for the website in Desktop mode.


## Install

#### npm

`npm i viewport-sizer`

#### Resize viewport automatically.
```javascript
var { resize } = require('viewport-sizer');


resize();


```

#### Set the viewport width manually
```javascript
var { resize } = require('viewport-sizer');


resize({width:1920});

```

#### Set the viewport height manually
```javascript
var { resize } = require('viewport-sizer');


resize({height:1080});

```

#### Set both widht and height of the viewport manually
```javascript
var { resize } = require('viewport-sizer');


resize({width:1500, height:900});

```

#### PostCSS plugin (recommended)

The package ships a built-in PostCSS plugin that automatically replaces `100vw` → `var(--cvw)` and `100vh` → `var(--cvh)` across all your stylesheets at build time — no manual CSS changes needed.

**postcss.config.js**
```js
module.exports = {
  plugins: [
    require('viewport-sizer/postcss')
  ]
}
```

**With Tailwind CSS** — place `viewport-sizer/postcss` after Tailwind so it processes Tailwind's generated CSS:
```js
module.exports = {
  plugins: [
    require('tailwindcss'),
    require('viewport-sizer/postcss')
  ]
}
```

**With Vite (vite.config.js)**
```js
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    postcss: {
      plugins: [require('viewport-sizer/postcss')]
    }
  }
});
```

Custom variable names are supported via options:
```js
require('viewport-sizer/postcss')({ vw: '--my-vw', vh: '--my-vh' })
```

#### Without PostCSS (manual)

The `resize()` call automatically injects `--cvw` and `--cvh` defaults into `:root` — you do not need to add them yourself. You only need to replace `100vw`/`100vh` in your styles:

    1. Replace `100vh` with `var(--cvh)`
    1. Replace `100vw` with `var(--cvw)`

##### Example
######   replace
```css
    body {
        width:100vw;
        height:100vh;
    }
```
######   with

```css
    body {
        width:var(--cvw);
        height:var(--cvh);
    }
```

Note: CSS replacement must be done at all the places.