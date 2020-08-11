# Sparrow

<!-- [![Known Vulnerabilities](https://snyk.io/test/github/winston0410/sparrow/badge.svg?targetFile=package.json)](https://snyk.io/test/github/winston0410/sparrow?targetFile=package.json) [![Maintainability](https://api.codeclimate.com/v1/badges/54626992beea73efcadf/maintainability)](https://codeclimate.com/github/winston0410/sparrow/maintainability) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/4f5f78d7736d4ed7b8439c2096bdc38f)](https://www.codacy.com/manual/winston0410/sparrow?utm_source=github.com&utm_medium=referral&utm_content=winston0410/sparrow&utm_campaign=Badge_Grade) [![Test Coverage](https://api.codeclimate.com/v1/badges/54626992beea73efcadf/test_coverage)](https://codeclimate.com/github/winston0410/sparrow/test_coverage) -->

 A PostCSS plugin that helps you remove, replace, append or prepend CSS declarations without the need of writing another PostCSS plugin. Avoid the hassle of learning new APIs again for using a new PostCSS plugin.

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
          targets: ['$(selector){font-size: 4px}'], // CSS declaration with placeholders.  This will target any selector with font-size: 4px as its rule.
          transformationOption: [{
            values: ['font-size: 4rem'], //Value for replacing, appending or prepending target value. Can be omitted if the operation: 'remove'
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

<!-- Remove -->

 ```css
/* Original Input */
.foo {
    font-size: 4px;
    width: 100%;
    margin: 10%;
    font-weight: 700;
}

.bar{
  font-size: 4px;
  height: 10%;
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
          targets: ['$(selector){$(prop): $(value)%}'], // CSS declaration with placeholders.  This will target any selector with font-size: 4px as its rule.
          transformationOption: [{
            operation: 'remove' // remove, replace, before, after
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
  font-size: 4px;
  font-weight: 700;
}

.bar{
  font-size: 4px;
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
          targets: ['$(a){font-size: 20px}'], // css declaration with placeholders
          transformationOption: [{
            values: ['font-size: 19px'], //Value for replacing, appending or prepending target value. Can be omitted if the operation: 'remove'
            operation: 'after' // remove, replace, before, after
          }]
        }
      ]
    })
  ]
}
```
