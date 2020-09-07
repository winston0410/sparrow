# Sparrow

[![Known Vulnerabilities](https://snyk.io/test/github/winston0410/sparrow/badge.svg?targetFile=package.json)](https://snyk.io/test/github/winston0410/sparrow?targetFile=package.json) [![Maintainability](https://api.codeclimate.com/v1/badges/54626992beea73efcadf/maintainability)](https://codeclimate.com/github/winston0410/sparrow/maintainability) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/4f5f78d7736d4ed7b8439c2096bdc38f)](https://www.codacy.com/manual/winston0410/sparrow?utm_source=github.com&utm_medium=referral&utm_content=winston0410/sparrow&utm_campaign=Badge_Grade) [![Test Coverage](https://api.codeclimate.com/v1/badges/54626992beea73efcadf/test_coverage)](https://codeclimate.com/github/winston0410/sparrow/test_coverage)

A PostCSS plugin that helps you **search CSS declarations** by **selectors**. Avoid the hassle of reinventing the wheel and filter selectors you want again when you create a new PostCSS plugin.


```css
/* Original Input */
.foo {
  padding: 4px;
  font-size: 20px;
  letter-spacing: 10px;
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
          callback: [
            (decl) => {
              //Decl is the declaration object selected based on your options.
              //Do transformation to decl here
              if(decl.prop === 'padding'){
                decl.remove()
              }
            },
            //You can also import plugins here
            require("postcss-sparrow-auto-text-indent").default  
          ]
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
  letter-spacing: 10px;
  text-indent: 10px;
}

.bar {
  margin: 50px;
}
```

## What can sparrow do for me?

With the power of Sparrow, you can easily **filter selectors** and transform them using PostCSS Sparrow plugins. You do not need to write filter logic again for a PostCSS plugin. **Focus on transforming CSS** instead.

Check out [all the examples here](https://github.com/winston0410/sparrow/blob/EXAMPLE.md).

## Made in Hong Kong :free: :free:

This plugin is made with love by a Hong Konger.

## Installation

As this plugin is a PostCSS plugin, you need to install and set up PostCSS first before use it. If you haven't used PostCSS before, set it up according to [official docs](https://github.com/postcss/postcss#usage).

Input this command in terminal and download this PostCSS plugin.

```shell
npm i postcss-sparrow
```

As this plugin requires PostCSS to parse your CSS first, you need to include it after plugins like [postcss-nested](https://www.npmjs.com/package/postcss-nested) or [postcss-mixins](https://www.npmjs.com/package/postcss-mixins).

## API Reference

### `options.selectors` : Array

An array of selectors that you want to match with. Use `*` as wildcard and select all selectors.

### `options.inclusion` : Boolean

True for including and False for excluding selectors listed in `options.selectors`.

### `options.callbacks` : Array

An array of callbacks that you use to transform the selected declarations.
