# Viewport Sizer

A lightweight package that normalises viewport units (`100vw` / `100vh`) across all screen sizes and desktop environments. It sets `--cvw` and `--cvh` CSS variables that accurately reflect the usable viewport, and optionally scales your layout to a target design width using CSS `zoom`.

---

## How it works

1. `resize()` runs in the browser, measures the actual viewport, and sets `--cvw` / `--cvh` on `:root`.
2. The PostCSS plugin replaces every `100vw` / `100vh` in your CSS files with `var(--cvw)` / `var(--cvh)` at build time.
3. For inline styles in JS/TS files (React `sx`, Angular `[style]`, Vue `:style`) the file watcher or Claude Code hook handles the replacement on save.

---

## Install

```bash
npm i viewport-sizer
```

---

## Quick start — all frameworks

| Step | What to do |
|---|---|
| 1 | Call `resize()` once after the app mounts |
| 2 | Add the PostCSS plugin to replace viewport units in CSS |
| 3 | Run the file watcher to replace viewport units in JS/TS inline styles |

---

## Step 1 — Call `resize()`

### React

```jsx
// src/index.jsx  or  src/App.jsx
import { useEffect } from 'react';
import { resize } from 'viewport-sizer';

function App() {
  useEffect(() => {
    resize();           // auto-detect screen width
    // resize({ width: 1920 });  // or target a specific design width
  }, []);

  return <YourApp />;
}
```

### Next.js (Pages Router — `_app.tsx`)

```tsx
// src/pages/_app.tsx
import { useEffect } from 'react';
import { resize } from 'viewport-sizer';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    resize();
  }, []);

  return <Component {...pageProps} />;
}
```

### Vue 3 (Composition API)

```vue
<!-- src/App.vue -->
<script setup>
import { onMounted } from 'vue';
import { resize } from 'viewport-sizer';

onMounted(() => {
  resize();
});
</script>
```

### Vue 2 (Options API)

```vue
<!-- src/App.vue -->
<script>
import { resize } from 'viewport-sizer';

export default {
  mounted() {
    resize();
  }
};
</script>
```

### Angular

```typescript
// src/app/app.component.ts
import { Component, AfterViewInit } from '@angular/core';
import { resize } from 'viewport-sizer';

@Component({ selector: 'app-root', templateUrl: './app.component.html' })
export class AppComponent implements AfterViewInit {
  ngAfterViewInit() {
    resize();
  }
}
```

### `resize()` options

```javascript
resize();                              // auto-detect — uses screen.width × devicePixelRatio
resize({ width: 1920 });               // scale layout to fit a 1920px design width
resize({ height: 1080 });              // fix viewport height
resize({ width: 1920, height: 1080 }); // fix both
```

### Automatic re-apply on navigation

You only need to call `resize()` **once**. Internally it patches `history.pushState` and `history.replaceState` and listens to `popstate`, so it re-applies automatically on every client-side route change — no extra framework code needed.

This works out of the box with **Next.js**, **React Router**, **Vue Router**, and **Angular Router** since all of them use the browser History API under the hood.

---

## Step 2 — PostCSS plugin

The PostCSS plugin rewrites `100vw` → `var(--cvw)` and `100vh` → `var(--cvh)` across **all CSS files** at build time.

### React (Create React App / CRACO)

```js
// postcss.config.js
module.exports = {
  plugins: {
    'viewport-sizer/postcss': {}
  }
};
```

### React / Vue 3 / Svelte (Vite)

```js
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  css: {
    postcss: {
      plugins: [require('viewport-sizer/postcss')]
    }
  }
});
```

### Next.js

Next.js requires plugins as an object map (not `require()`). Install the peer deps first:

```bash
npm i postcss-flexbugs-fixes postcss-preset-env
```

```js
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-flexbugs-fixes': {},
    'postcss-preset-env': {
      autoprefixer: { flexbox: 'no-2009' },
      stage: 3,
      features: { 'custom-properties': false }
    },
    'viewport-sizer/postcss': {}
  }
};
```

### Vue 2 (Vue CLI)

```js
// postcss.config.js  or  vue.config.js → css.loaderOptions.postcss
module.exports = {
  plugins: {
    'viewport-sizer/postcss': {}
  }
};
```

### Angular

```js
// postcss.config.js  (place at project root)
module.exports = {
  plugins: {
    'viewport-sizer/postcss': {}
  }
};
```

Angular CLI automatically picks up `postcss.config.js` from the project root.

### With Tailwind CSS (any framework)

Place `viewport-sizer/postcss` **after** Tailwind so it processes Tailwind's generated output:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'viewport-sizer/postcss': {}
  }
};
```

### Custom variable names

```js
// postcss.config.js
module.exports = {
  plugins: {
    'viewport-sizer/postcss': { vw: '--my-vw', vh: '--my-vh' }
  }
};
```

---

## Step 3 — Replace viewport units in inline JS/TS styles

The PostCSS plugin only processes `.css` files. Inline styles in component files need separate handling.

**The problem** — these are NOT processed by PostCSS:

```tsx
// React / Next.js
<Box sx={{ width: '100vw', height: '100vh' }} />

// Vue
<div :style="{ width: '100vw', height: '100vh' }"></div>

// Angular
<div [style.width]="'100vw'" [style.height]="'100vh'"></div>
```

**The fix** — use `var(--cvw)` / `var(--cvh)` directly:

```tsx
<Box sx={{ width: 'var(--cvw)', height: 'var(--cvh)' }} />
```

### Option A — File watcher (recommended)

Run alongside your dev server. Automatically replaces `100vw`, `100vh`, and `100svh` in any `.tsx`/`.ts`/`.jsx`/`.js` file the moment you save it.

```bash
npx viewport-sizer-watch src
```

Add to `package.json` to run it as part of your workflow:

```json
{
  "scripts": {
    "dev": "vite",
    "watch:viewport": "viewport-sizer-watch src"
  }
}
```

Run both in parallel:

```bash
npm run watch:viewport &  npm run dev
```

### Option B — One-time bulk replacement

Run once to fix all existing files in your project:

```bash
npx viewport-sizer-replace src
```

### Option C — Claude Code hook (AI-assisted development)

If you use [Claude Code](https://claude.ai/code), add this to `.claude/settings.json` in your project root. Every file Claude edits is automatically fixed:

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

### Replacement table

| Before | After |
|---|---|
| `100vw` | `var(--cvw)` |
| `100vh` | `var(--cvh)` |
| `100svh` | `var(--cvh)` |
| `calc(100vh - 80px)` | `calc(var(--cvh) - 80px)` |
| `calc(100vw - 240px)` | `calc(var(--cvw) - 240px)` |

---

## Manual CSS replacement

If you prefer not to use PostCSS, replace the values in your CSS files by hand:

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

> The `resize()` call automatically injects the `--cvw` and `--cvh` defaults into `:root`, so you do not need to define them yourself.

---

## Framework integration summary

| Framework | `resize()` location | PostCSS config | Inline style fix |
|---|---|---|---|
| React | `useEffect` in root component | `postcss.config.js` | File watcher / replace CLI |
| Next.js | `useEffect` in `_app.tsx` | `postcss.config.js` (object form) | File watcher / replace CLI |
| Vue 3 | `onMounted` in `App.vue` | `postcss.config.js` or `vite.config.js` | File watcher / replace CLI |
| Vue 2 | `mounted` in `App.vue` | `postcss.config.js` or `vue.config.js` | File watcher / replace CLI |
| Angular | `ngAfterViewInit` in `AppComponent` | `postcss.config.js` at project root | File watcher / replace CLI |
