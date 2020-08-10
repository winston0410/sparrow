# Sparrow

A PostCSS plugin that helps you remove, replace, append or prepend CSS declarations without the need of writing another PostCSS plugin.  Avoid the hassle of learning new APIs again for using a new PostCSS plugin.

```css
/* Original Input */
.foo {
    font-size: 4px;
}

.bar{
  font-size: 4px;
}
```

```javascript
//postcss.config.js or other files you use to config PostCSS

module.exports = {
  plugins: [
    //Other plugins...

    require('sparrow')({
      transformationList: [
        {
          target: ['$(a){font-size: 4px}'], // CSS declaration with placeholders.  This will target any selector with font-size: 4px as its rule.
          transformationOption: [{
            value: ['font-size: 4rem'], //Value for replacing, appending or prepending target value. Can be omitted if the operation: 'remove'
            operation: 'replace' // remove, replace, before, after
          }]
        }
      ]
    })
  ]
}
```

```css
/* After the transformation of sparrow*/
.foo {
  font-size: 4rem;
}

.bar{
  font-size: 4rem;
}
```

## Made in Hong Kong :free: :free:

This plugin is made with love by a Hong Konger.

## Placeholder syntax

TODO

## Installation

As this plugin is a PostCSS plugin, you need to install and set up PostCSS first before use it. If you haven't used PostCSS before, set it up according to [official docs](https://github.com/postcss/postcss#usage).

Input this command in terminal and download this PostCSS plugin.

```shell
npm i sparrow
```

```javascript
//postcss.config.js or other files you use to config PostCSS

module.exports = {
  plugins: [
    //Other plugins...

    require('sparrow')({
      transformationList: [
        {
          target: ['$(a){font-size: 20px}'], // css declaration with placeholders
          transformationOption: [{
            value: ['font-size: 19px'], //Value for replacing, appending or prepending target value. Can be omitted if the operation: 'remove'
            operation: 'after' // remove, replace, before, after
          }]
        }
      ]
    })
  ]
}
```
