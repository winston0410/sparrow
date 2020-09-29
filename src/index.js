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
  declarations,
  atRules,
  rules
}) => {
  const options = {
    declarations: R.defaultTo([])(declarations),
    atRules: R.defaultTo([])(atRules),
    rules: R.defaultTo([])(rules)
  }

  // const rulesTransformations = R.pipe(
  //   addComparatorFnToSelectors
  // )(options.rules)

  const declarationsTransformations = R.pipe(
    addComparatorFnToSelectors
  )(options.declarations)

  return {
    postcssPlugin: 'postcss-sparrow',
    AtRule (atRule) {

    },
    Rule (rule) {
      console.log(rule)
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
      )(declarationsTransformations)
    }
  }
}
module.exports.postcss = true
