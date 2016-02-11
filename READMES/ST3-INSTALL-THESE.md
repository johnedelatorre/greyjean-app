### Sublime Text 3 oh joy!


##### Here are the plugins to install and user prefs and shortcuts to match

#### Snippets

* Check the `/st3-snippets` dir for snippets to use for joy
    - Add the snippets to your `Packages/User/` dir in Sublime Text 3 - to find it go to `Sublime Text > Preferences > Browse Packages...`
    - This will open a finder window in the correct dir. Now look for the `Packages/User/` dir. Put all the snippets inside `Packages/User/Snippets`
    - If you don't have a `Snippets/` dir then create one and copy the all the snippets in our project to that dir.

#### Plugins to install

> add the below to your user `Sublime Text > Preferences > Key Bindings - User`

```json
  [
      {
          "keys": ["super+alt+up"],
          "command": "select_lines",
          "args": {
              "forward": false
          }
      },
      {
          "keys": ["super+alt+down"],
          "command": "select_lines",
          "args": {
              "forward": true
          }
      },
      {
          "keys": ["super+shift+r"],
          "command": "goto_symbol_in_project"
      },
      {
          "keys": ["control+alt+;"],
          "command": "align_tab",
          "args" : {
              "user_input" : ":/f"
          }
      },
      {
          "keys": ["control+alt+="],
          "command": "align_tab",
          "args" : {
              "user_input" : "=/f"
          }
      },
      {
          "keys": ["control+alt+."],
          "command": "align_tab",
          "args" : {
              "user_input" : "=>/f"
          }
      },
      {
          "keys": ["super+k", "super+s"],
          "command": "swap_case"
      },
      {
          "keys": ["super+k", "super+t"],
          "command": "title_case"
      }
  ]
```
* AlignTab
    - aligns all the things under cursor by `=`, `:`, `=>`, `space`, `comma`, or even by regex
* ApplySyntax
    - detects syntax and applys automatically
* Color Highlighter
    - adds underline with color to variables, hex, rgba, and hsla
* GitGutter
    - adds color highlight to gutter for changes to repo
* All Autocomplete
    - add autocomplete options from all the files in project
* DocBlockr
    - easily add docblockr comment to js files
    - use `/**`then `tab` to expand comment
* Dotfiles Syntax Highlighting
    - add syntax highlighting to many dotfiles not present out of box
* Comments Aware Enter
    - continues scope on enter when in comment
* Duplicate Lines
    - after adding key bindings then
    - use `cmd+shift+d` to duplicate line under cursor
* EditorConfig
    - automatically adds syntax based on config in .editorconfig
* Emmet
    - The only way to write HTML
* Hayaku
    - The only way to write CSS/LESS/SASS
* Git Config
    - adds syntax highlighting to .gitconfig files
* JavascriptNext - ES6 Syntax
    - add syntax coloring for es6 "Harmony" syntax
* LESS
    - adds syntax and support for LESS
* pretty JSON
    - prettify all your JSON syntax and coloring
* TodoReview
    - this is how we will all collab on todos
    - we have several flags to set, put the below in your `Sublime Text > Preferences > Package Settings > TodoReview > Settings - User`
    - after you have configured these settings then you can open Package Control with `cmd+shift+p` and type `todo` then select `TodoReview: Project and Open Files`
    - it will then open a file with all the TODO's and other flags
    - you can make a TODO or other flag by making a comment in whatever language
    - use it like this:

#### Place this in the file `Sublime Text > Preferences > Package Settings > TodoReview > Settings - User`

```json
{
    "patterns": {
        "BUGFIX"  : "BUGFIX[\\s]*?:+(?P<bugfix>.*)$",
        "FEATURE" : "FEATURE[\\s]*?:+(?P<feature>.*)$",
        "ZELDA"   : "ZELDA[\\s]*?:+(?P<zelda>.*)$",
        "FLUX"    : "FLUX[\\s]*?:+(?P<flux>.*)$",
        "JANK"    : "JANK[\\s]*?:+(?P<jank>.*)$",
        "ICANHAZ" : "ICANHAZ[\\s]*?:+(?P<icanhaz>.*)$",
        "HOWTO"   : "HOWTO[\\s]*?:+(?P<howto>.*)$",
        "CRUCIAL" : "CRUCIAL[\\s]*?:+(?P<crucial>.*)$",
        "FIXTHIS" : "FIXTHIS[\\s]*?:+(?P<fixthis>.*)$",
        "CATNAP"  : "CATNAP[\\s]*?:+(?P<catnap>.*)$",
    },
    "exclude_folders": [
        "*.git*",
        "*node_modules*",
        "*bower_components*",
        "*wp-admin*",
        "*wp-includes*",
        "*dist*",
        "*.settings*",
        "*src/vendor*",
        "*src/transpiled*"
    ],
    "exclude_files": [],
    "case_sensitive": false,
    // "render_include_folder": false,
    "render_spaces": 1
}
```

### Example usage

##### for js

```js
  // TODO:    => is my todo and it will show up in TodoReview
  //
  // or
  //
  // HOWTO:   => leave reference or instructions for yourself or others
  //
  // or
  //
  // FLUX:    => is something commented out we will add
  //
  // or
  //
  // FIXTHIS: => needs to be fixed
  //
  // or
  //
  // CRUCIAL: => very super important needs to be fixed immediately
  //
  // or
  //
  // ICANHAZ: => if you need to ask another on the team
  //
  // or
  //
  // JANK:    => needs to be refactored at some point
  //
  // or
  //
  // FEATURE: => commented out or will be added later or needs to be built
  //
  // or
  //
  // BUGFIX:  => bug that needs to be ticketed and/or fixed
  //
  // or
  //
  // ZELDA:   => something you would like but is not crucial
  //
  // or
  //
  // CATNAP:  => something that needs to be done but can wait for later
```

##### for HTML

```html
  <!-- TODO: this is my todo and it will show up in TodoReview -->
```

##### for LESS/SASS/CSS

```sass
  // TODO: this is my todo and it will show up in TodoReview
```

* if you want the TODO for some reason to survive the compile and make it into the CSS file from the LESS or SASS files
    - this shouldn't be necessary but just in case you want to leave comments in vendor CSS or otherwise
    - then do this

##### for to survive compile LESS/SASS/CSS

```sass
  /** TODO: this todo will survive the compile to CSS from the SASS or LESS */
```

* TrailingSpaces
    - highlights trailing whitespace and deletes in on save
