const R = require('ramda')

const {
  isArray,
  isBoolean
} = require('./utilities/helper.js')

const {
  addComparatorFnToSelectors,
  getNodesBySelectors
} = require('./utilities/selectors.js')

module.exports = ({
  declaration
}) => {
  const options = {
    declaration: R.defaultTo([])(declaration)
  }

  const validatedTransformations = R.pipe(
    R.filter(
      R.where({
        selectors: isArray,
        inclusion: isBoolean,
        callbacks: isArray
      })
    ),
    addComparatorFnToSelectors
  )(options.declaration)

  return {
    postcssPlugin: 'postcss-sparrow',
    AtRule (atRule) {

    },
    Rule (rule) {

    },
    Declaration (decl) {
      R.map(
        (transformation) => R.when(
          R.pipe(
            R.prop('parent'),
            getNodesBySelectors(transformation)
          ),
          R.juxt(transformation.callbacks)
        )(decl)
      )(validatedTransformations)
    }
  }
}
module.exports.postcss = true
