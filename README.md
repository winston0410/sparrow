# Sparrow

[![Known Vulnerabilities](https://snyk.io/test/github/winston0410/sparrow/badge.svg?targetFile=package.json)](https://snyk.io/test/github/winston0410/sparrow?targetFile=package.json) [![Maintainability](https://api.codeclimate.com/v1/badges/54626992beea73efcadf/maintainability)](https://codeclimate.com/github/winston0410/sparrow/maintainability) [![Codacy Badge](https://app.codacy.com/project/badge/Grade/4f5f78d7736d4ed7b8439c2096bdc38f)](https://www.codacy.com/manual/winston0410/sparrow?utm_source=github.com&utm_medium=referral&utm_content=winston0410/sparrow&utm_campaign=Badge_Grade) [![Test Coverage](https://api.codeclimate.com/v1/badges/54626992beea73efcadf/test_coverage)](https://codeclimate.com/github/winston0410/sparrow/test_coverage)

![Cover image for PostCSS Sparrow](./cover.jpg)

A PostCSS plugin that helps you **search CSS declarations and rules** by **selectors**. Avoid the hassle of reinventing the wheel and filter selectors you want again when you create a new PostCSS plugin.

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
      declarations: [
        {
          selectors: ['*'],
          inclusion: true,
          callbacks: [
            (decl) => {
              //Decl is the declaration object selected based on your options.
              //Do transformation to decl here
              if(decl.prop === 'padding'){
                decl.remove()
              }
            },
            //You can also import plugins here
            require("postcss-sparrow-auto-text-indent")
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

Check out [all PostCSS Sparrow plugins here](https://github.com/winston0410/sparrow/blob/master/LIST.md).

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

### `options.rules`

For matching CSS Rules. E.g. `a{}`.

#### `options.rules.selectors` : Array

An array of selectors that you want to match with. Use `*` as wildcard and select all selectors.

#### `options.rules.inclusion` : Boolean

True for including and False for excluding selectors listed in `options.selectors`.

#### `options.rules.callbacks` : Array

An array of callbacks that you use to transform the selected declarations. The selected declaration will be passed in as an argument.

### `options.declarations`

For matching CSS Declarations. E.g. `font-size: 18px;`.

#### `options.declarations.selectors` : Array

An array of selectors that you want to match with. Use `*` as wildcard and select all selectors.

#### `options.declarations.inclusion` : Boolean

True for including and False for excluding selectors listed in `options.selectors`.

#### `options.declarations.callbacks` : Array

An array of callbacks that you use to transform the selected declarations. The selected declaration will be passed in as an argument.

## Breaking changes

### V1.0.0

PostCSS Sparrow has upgraded its code for PostCSS 8\. It will not be compatible with any version lower than 8.0.0.

### V2.0.0

PostCSS Sparrow now filter for **Declarations**, **Rules** and **AtRules**. Therefore, `options.transformations` which originally used for filtering declarations is renamed to `options.declarations`.
