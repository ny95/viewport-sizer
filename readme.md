# Viewport Sizer

Simple plugin for auto resizing the browser viewport for the website in Desktop mode.


## Install

#### npm

`npm i viewport-sizer`

---

## Usage

#### Resize viewport automatically
```javascript
var { resize } = require('viewport-sizer');

resize();
```

#### Set the viewport width manually
```javascript
var { resize } = require('viewport-sizer');

resize({ width: 1920 });
```

#### Set the viewport height manually
```javascript
var { resize } = require('viewport-sizer');

resize({ height: 1080 });
```

#### Set both width and height of the viewport manually
```javascript
var { resize } = require('viewport-sizer');

resize({ width: 1500, height: 900 });
```

---

## PostCSS plugin (recommended)

The package ships a built-in PostCSS plugin that automatically replaces `100vw` → `var(--cvw)` and `100vh` → `var(--cvh)` across all your stylesheets at build time — no manual CSS changes needed.

**postcss.config.js**
```js
module.exports = {
  plugins: {
    'viewport-sizer/postcss': {}
  }
}
```

**With Tailwind CSS** — place `viewport-sizer/postcss` after Tailwind so it processes Tailwind's generated CSS:
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    'viewport-sizer/postcss': {}
  }
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

**With Next.js** — Next.js requires plugins to be declared as an object, not using `require()`:
```js
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: { flexbox: 'no-2009' },
      stage: 3,
      features: { 'custom-properties': false },
    },
    'viewport-sizer/postcss': {},
  },
};
```

Custom variable names are supported via options:
```js
require('viewport-sizer/postcss')({ vw: '--my-vw', vh: '--my-vh' })
```

---

## File watcher — auto-replace on save

The PostCSS plugin handles `.css` files, but inline styles in `.tsx`/`.jsx`/`.ts`/`.js` files (e.g. MUI `sx={{}}` or `style={{}}` props) are not processed at build time. The built-in file watcher auto-replaces `100vw`, `100vh`, and `100svh` in those files whenever you save.

#### Start the watcher

```bash
npx viewport-sizer-watch src
```

Or add it to your `package.json` scripts and run alongside your dev server:

```json
{
  "scripts": {
    "watch:viewport": "viewport-sizer-watch src"
  }
}
```

```bash
npm run watch:viewport
```

The watcher targets the directory you pass as an argument (defaults to `src` if omitted). It replaces:

| Before | After |
|---|---|
| `100vw` | `var(--cvw)` |
| `100vh` | `var(--cvh)` |
| `100svh` | `var(--cvh)` |

This includes values inside `calc()` expressions, e.g. `calc(100vh - 80px)` → `calc(var(--cvh) - 80px)`.

---

## Claude Code hook — auto-replace on every AI edit

If you use [Claude Code](https://claude.ai/code), you can wire up a hook so that every file Claude edits is automatically fixed. Create `.claude/settings.json` in your project root:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node node_modules/viewport-sizer/replace.js",
            "statusMessage": "Fixing viewport units..."
          }
        ]
      }
    ]
  }
}
```

The hook reads the edited file path from Claude Code's stdin JSON and runs the replacement automatically after every edit.

---

## Manual replacement

The `resize()` call automatically injects `--cvw` and `--cvh` defaults into `:root`. If you prefer to replace values by hand:

1. Replace `100vh` with `var(--cvh)`
2. Replace `100vw` with `var(--cvw)`

**Before**
```css
body {
    width: 100vw;
    height: 100vh;
}
```

**After**
```css
body {
    width: var(--cvw);
    height: var(--cvh);
}
```

> **Note:** CSS replacement must be done in all places. Use the file watcher or PostCSS plugin to avoid doing this manually.
