# Sparrow

[![Known Vulnerabilities](https://snyk.io/test/github/winston0410/sparrow/badge.svg?targetFile=package.json)](https://snyk.io/test/github/winston0410/sparrow?targetFile=package.json) [![Maintainability](https://api.codeclimate.com/v1/badges/54626992beea73efcadf/maintainability)](https://codeclimate.com/github/winston0410/sparrow/maintainability) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/4f5f78d7736d4ed7b8439c2096bdc38f)](https://www.codacy.com/manual/winston0410/sparrow?utm_source=github.com&utm_medium=referral&utm_content=winston0410/sparrow&utm_campaign=Badge_Grade) [![Test Coverage](https://api.codeclimate.com/v1/badges/54626992beea73efcadf/test_coverage)](https://codeclimate.com/github/winston0410/sparrow/test_coverage)

A PostCSS plugin that helps you **search and remove, replace, append or prepend CSS declarations** without the need of writing another PostCSS plugin. Avoid the hassle of learning new APIs again for using a new PostCSS plugin.


```css
/* Original Input */
.foo {
  padding: 4px;
  font-size: 20px;
}

.bar {
  margin: 50px;
  padding: 4px;
}
```

```javascript
//postcss.config.js or other files you use to config PostCSS

module.exports = {
  plugins: [
    //Other plugins...

    require('postcss-sparrow')({
      transformations: [
        {
          selectors: ['*'],
          inclusion: true,
          decls: [{
            prop: 'padding',
            value: '4px',
            inclusion: true,
            newDecl: {
              operation: 'remove'
            }
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
  font-size: 20px;
}

.bar {
  margin: 50px;
}
```

## What can sparrow do for me?

With the power of Sparrow, you can easily replace other PostCSS plugins. Check out [all the examples here](https://github.com/winston0410/sparrow/blob/EXAMPLE.md).

## Made in Hong Kong :free: :free:

This plugin is made with love by a Hong Konger.

## Installation

As this plugin is a PostCSS plugin, you need to install and set up PostCSS first before use it. If you haven't used PostCSS before, set it up according to [official docs](https://github.com/postcss/postcss#usage).

Input this command in terminal and download this PostCSS plugin.

```shell
npm i postcss-sparrow
```

As this plugin requires PostCSS to parse your CSS first, you need to include it after plugins like [postcss-nested](https://www.npmjs.com/package/postcss-nested) or [postcss-mixins](https://www.npmjs.com/package/postcss-mixins).

```javascript
//postcss.config.js or other files you use to config PostCSS

module.exports = {
  plugins: [
    //Other plugins...

    require('postcss-sparrow')({
            transformations: [
              {
                selectors: ['h1', 'h2', 'h3'], //An array of selectors you want to target
                inclusion: true, //Use inclusion or exclusion logic on the selectors array
                decls: [{ //An array of CSS declarations which you want to transform or target
                  prop: 'font-family', //Property name
                  value: '*', //Value name, using wildcard * will select all values
                  inclusion: true, //Use inclusion or exclusion logic for both prop and value field
                  newDecl: { // An object of CSS declaration which you use for transformation
                    prop: 'font-weight', //Prop and value are unnecessary for 'remove' operation
                    value: '700',
                    operation: 'before' //Accepts 'remove', 'replace', 'before'
                  }
                }]
              }
            ]
          })
  ]
}
```

## API Reference
TODO
