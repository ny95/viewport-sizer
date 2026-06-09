# Viewport Sizer

A lightweight package that normalises all viewport unit variants for **laptop and desktop screens**. Each unit maps to its own CSS custom property so the original semantic intent is preserved on every device.

| CSS written | Custom property | Desktop value | Mobile value |
|---|---|---|---|
| `100vw` | `var(--cvw)` | scaled `px` | `100vw` |
| `100svw` | `var(--csvw)` | same scaled `px` | `100svw` |
| `100dvw` | `var(--cdvw)` | same scaled `px` | `100dvw` |
| `100lvw` | `var(--clvw)` | same scaled `px` | `100lvw` |
| `100vh` | `var(--cvh)` | scaled `px` | `100vh` |
| `100svh` | `var(--csvh)` | same scaled `px` | `100svh` |
| `100dvh` | `var(--cdvh)` | same scaled `px` | `100dvh` |
| `100lvh` | `var(--clvh)` | same scaled `px` | `100lvh` |

On **desktop / laptop (≥ 1024 px)** all width variables share the same scaled pixel value and all height variables share the same scaled pixel value — because `svw = dvw = lvw = vw` and `svh = dvh = lvh = vh` on desktop (no collapsing browser chrome).

On **mobile / tablet (< 1024 px)** each variable reverts to its own native unit so the browser resolves `svh`, `dvh`, and `lvh` correctly (collapsing address bar behaviour is preserved).

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
    resize({ width: 3840 }); // target design width in px
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
resize({ width: 1920 });               // scale layout to fit a 1920 px design width
resize({ height: 1080 });              // fix viewport height
resize({ width: 1920, height: 1080 }); // fix both
```

### Automatic re-apply on navigation and resize

You only need to call `resize()` **once**. Internally it sets up three automatic triggers — all of which always use the **latest** params passed to `resize()`:

| Trigger | Behaviour |
|---|---|
| `window` resize (debounced 150 ms) | Re-runs on every viewport width change. Crossing 1024 px switches between desktop scaling and the mobile fallback automatically. |
| `popstate` event | Re-runs on browser back / forward navigation. |
| `history.pushState` / `history.replaceState` patch | Re-runs on every client-side route change. |

This works out of the box with **Next.js**, **React Router**, **Vue Router**, and **Angular Router** since all of them use the browser History API under the hood.

---

## Step 2 — PostCSS plugin

The PostCSS plugin rewrites all eight viewport unit variants in **every CSS file** at build time. Each unit maps to its own custom property (see the table at the top).

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

All eight variable names are configurable:

```js
// postcss.config.js
module.exports = {
  plugins: {
    'viewport-sizer/postcss': {
      vw:  '--my-vw',
      svw: '--my-svw',
      dvw: '--my-dvw',
      lvw: '--my-lvw',
      vh:  '--my-vh',
      svh: '--my-svh',
      dvh: '--my-dvh',
      lvh: '--my-lvh',
    }
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

**The fix** — use the custom properties directly:

```tsx
<Box sx={{ width: 'var(--cvw)', height: 'var(--cvh)' }} />
<Box sx={{ height: 'var(--csvh)' }} /> {/* preserves svh intent on mobile */}
```

### Option A — File watcher (recommended)

Run alongside your dev server. Automatically replaces all viewport units inside **string literals** in any `.tsx` / `.ts` / `.jsx` / `.js` file the moment you save it. Replacements are scoped to string literals only — comments and non-CSS identifiers are left untouched.

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

### Replacement table (PostCSS + file watcher)

| Before | After |
|---|---|
| `100vw` | `var(--cvw)` |
| `100svw` | `var(--csvw)` |
| `100dvw` | `var(--cdvw)` |
| `100lvw` | `var(--clvw)` |
| `100vh` | `var(--cvh)` |
| `100svh` | `var(--csvh)` |
| `100dvh` | `var(--cdvh)` |
| `100lvh` | `var(--clvh)` |
| `calc(100vh - 80px)` | `calc(var(--cvh) - 80px)` |
| `calc(100vw - 240px)` | `calc(var(--cvw) - 240px)` |

---

## Manual CSS replacement

If you prefer not to use PostCSS, replace the values in your CSS files by hand:

**Before**
```css
.full-screen {
  width: 100vw;
  height: 100svh; /* small viewport height for mobile chrome */
}
```

**After**
```css
.full-screen {
  width: var(--cvw);
  height: var(--csvh);
}
```

> `resize()` automatically injects all eight variable defaults into `:root` — you do not need to define them yourself.

---

## Desktop-only design

This plugin is intentionally built for **laptop and desktop layouts only**. The zoom-and-scale logic assumes a wide viewport and a fixed design width. It must not run on narrow mobile viewports.

### Breakpoint behaviour

| Viewport width | Width vars | Height vars | `body` zoom |
|---|---|---|---|
| ≥ 1024 px (laptop / desktop) | Same scaled `px` value for `--cvw`, `--csvw`, `--cdvw`, `--clvw` | Same scaled `px` value for `--cvh`, `--csvh`, `--cdvh`, `--clvh` | Calculated to fit design width |
| < 1024 px (mobile / tablet) | `--cvw: 100vw` `--csvw: 100svw` `--cdvw: 100dvw` `--clvw: 100lvw` | `--cvh: 100vh` `--csvh: 100svh` `--cdvh: 100dvh` `--clvh: 100lvh` | Reset to `''` (no zoom) |

The 1024 px threshold is fixed inside the library. Crossing it in either direction — by resizing the browser window or rotating a device — switches modes within 150 ms.

### Why all variants share the same value on desktop

On desktop browsers there is no collapsing address bar or navigation chrome, so `svh = dvh = lvh = vh` and `svw = dvw = lvw = vw`. Using separate variables preserves the semantic intent of the original unit: on mobile the browser resolves each one correctly, on desktop they all collapse to the same scaled pixel value.

---

## Framework integration summary

| Framework | `resize()` location | PostCSS config | Inline style fix |
|---|---|---|---|
| React | `useEffect` in root component | `postcss.config.js` | File watcher / replace CLI |
| Next.js | `useEffect` in `_app.tsx` | `postcss.config.js` (object form) | File watcher / replace CLI |
| Vue 3 | `onMounted` in `App.vue` | `postcss.config.js` or `vite.config.js` | File watcher / replace CLI |
| Vue 2 | `mounted` in `App.vue` | `postcss.config.js` or `vue.config.js` | File watcher / replace CLI |
| Angular | `ngAfterViewInit` in `AppComponent` | `postcss.config.js` at project root | File watcher / replace CLI |
