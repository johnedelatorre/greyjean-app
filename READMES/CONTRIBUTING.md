# CSS / Less

#####  Once you install editor config it will set some of these defaults for you.

* Indented with 2 spaces
* No more than 4 levels of nesting
* Only nest when has advantages
* space after class name or attribute before bracket `.class {`
* space after class declaration before next declaration Ex:

```sass
// THIS IS GOOD
// this is good note space between class declarations

.item {
  height: auto;
  min-height: 100%;
}

.item-alt {
  height: 100%;
}

// BAD: DO NOT DO THIS IF YOU SEE IT PLEASE FIX
// no space between class declarations

.item {
  height: auto;
  min-height: 100%;
}
.item-alt {
  height: 100%;
}

// BAD: DO NOT DO THIS IF YOU SEE IT PLEASE FIX
// indentation and no space between class declarations

.item {
  height: auto;
  min-height: 100%;
}
  .item-alt {
    height: 100%;
  }
```

* NO styling with IDs (see `NOTE #1`)

```less
// NEVER EVER DO THIS

#ids-suck-the-most {
  color: @suckyid-color;
}
```

* classnames with dashes or underscores (dashes preferred)
* classnames built with `object-modifier` logic (object dash modifier)
* some people are using `object--modifier` note the `--` (double dashes)
* I personally chose not to do this because of the millions of extra dash key presses per day just for the `--` so if you want to it's up to you
* use `@color-variables` for colors always. NEVER hardcode hexcodes anywhere like this `#fbfbf8` it will break our modularity
* use `px` for sizing Bootstrap is already so we will continue that for solidarity
* If you cannot find a good place to put new appropriate styles make a new partial and import it into `app.less`
* If you need more color classes define them in `app.colors.less`

*NOTE #1* => DO NOT USE #ID's TO STYLE. #ID's are not reusable and they are stinky. We are only using them for reference in JS and even then hardly ever, now that we have `querySelector` in JS. We are only using classes or by attribute is also acceptable.

Ex.

```sass
// this is force luke use these ways
// we include all appropriate modifiers in the main
// style declaration below

.item {
  height: auto;
  min-height: 100%;
  position: relative;
  &:before { // shorthand for before
    content: "";
    position: absolute;
    width: inherit;
    top: 0;
    bottom: 0;
    z-index: -1;
    background-color: @body-bg;
    border: inherit;
    display: block;
  }
  &:active { // is active
    width: 100%;
  }
  &.error { // has error class
    background-color: @error;
  }
  .menu-active & { // style when parent object has modifier class
    top: 125px;
    background-color: @menu-active;
  }
}

// this type of alignment is also acceptable
// you can use the package aligntab with included shortcut
// ctrl+opt+:  =>   align by colon

.item {
  height     : auto;
  min-height : 100%;
  position   : relative;
  // shorthand for before
  &:before {
    content          : "";
    position         : absolute;
    width            : inherit;
    top              : 0;
    bottom           : 0;
    z-index          : -1;
    background-color : @body-bg;
    border           : inherit;
    display          : block;
  }
  // is active
  &:active {
    width: 100%;
  }
  // has error class
  &.error {
    background-color: @error;
  }
  // style when parent object has modifier class
  .menu-active & {
    top              : 125px;
    background-color : @menu-active;
  }
}

// this is also acceptable select by attributes

[data-name="cats"] {
  // selects only immediate children
  > {
    padding: 15px
  }
  // with nth-child selector
  &:nth-child(2n+1) {
    padding-bottom: 0;
  }
}

// or this is also acceptable select by attributes with element selector

section[data-name="cats"] {
  // selects only immediate children
  > {
    padding: 15px
  }
  // with nth-child selector
  &:nth-child(2n+1) {
    padding-bottom: 0;
  }
}
```
