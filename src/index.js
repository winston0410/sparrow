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
  transformations
}) => {
  const options = {
    transformations: R.defaultTo([])(transformations)
  }

  const validatedTransformations = R.pipe(
    R.filter(
      R.where({
        selectors: isArray,
        inclusion: isBoolean
      })
    ),
    addComparatorFnToSelectors
  )(options.transformations)

  return (root, result) => {
    R.map(
      (transformation) => root.walkDecls((decl) => {
        const result = R.when(
          R.pipe(
            R.prop('parent'),
            getNodesBySelectors(transformation)
          ),
          R.juxt(transformation.callback)
        )(decl)
      })
    )(validatedTransformations)
  }
})
