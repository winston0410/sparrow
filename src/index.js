const postcss = require('postcss')
const R = require('ramda')

const {
  isArray,
  isBoolean
} = require('./utilities/helper.js')

const {
  addComparatorFnToSelectors,
  getNodesBySelectors,
  getSelectors,
  selectorsLens
} = require('./utilities/selectors.js')

const {
  nodesLens
} = require('./utilities/nodes.js')

module.exports = postcss.plugin('postcss-sparrow', ({
  transformations,
  silentConsole,
  placeholderPattern
}) => {
  const options = {
    transformations: R.defaultTo([])(transformations),
    placeholderPattern: R.defaultTo(/^\$\(\w*\)/g)(placeholderPattern)
  }

  const validatedTransformations = R.pipe(
    R.filter(
      R.where({
        selectors: isArray,
        inclusion: isBoolean,
        decls: isArray
      })
    ),
    addComparatorFnToSelectors
  )(options.transformations)

  return (root, result) => {
    R.map(
      (transformation) => root.walkDecls((decl) => {
        const node = decl

        const result = R.when(
          R.pipe(
            R.prop('parent'),
            getNodesBySelectors(transformation)
          ),
          R.identity
        )(node)

        // console.log(result)
      })
    )(validatedTransformations)
  }
})
