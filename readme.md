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

#### Add below css variable in root 
```css
:root {
--custom-vw:100vw;
--custom-vh:100vh;
}
```
### Following css change must be done
    1. Replace `100vh` with `--custom-vh`
    1. Replace `100vw` with `--custom-vw`