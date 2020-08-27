const postcss = require('postcss')
const R = require('ramda')

const {
  isArray,
  isRegExp,
  isBoolean,
  isString,
  fromNestedLoop,
  mergeNodesBySelector
} = require('./utilities/helper.js')

const {
  addComparatorFnToSelectors,
  getSelectors,
  selectorsLens
} = require('./utilities/selectors.js')

const {
  addComparatorFnToDecls,
  getDecls
} = require('./utilities/decls.js')

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
    addComparatorFnToSelectors,
    addComparatorFnToDecls
  )(options.transformations)

  const transformDecls = () => {

  }

  const getNodesBySelectors = (transformation) => (obj) => R.pipe(
    getSelectors,
    R.applyTo(obj)
  )(transformation)

  const getDeclsByPropAndValue = (transformation) => (obj) => R.pipe(
    getDecls,
    R.anyPass,
    R.applyTo(obj)
  )(transformation)

  return (root, result) => {
    R.map(
      (transformation) => root.walkDecls((decl) => {
        const node = decl

        return R.when(
          R.pipe(
            R.prop('parent'),
            getNodesBySelectors(transformation)
          ),
          R.when(
            getDeclsByPropAndValue(transformation),
            (v) => {
              console.log('Found matching node')
              console.log(v)
            }
          )
        )(node)
      })
    )(validatedTransformations)
  }
})
