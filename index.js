const postcss = require('postcss')
const R = require('ramda')

const {
  isArray,
  isRegExp,
  isBoolean,
  isString,
  fromNestedLoop,
  mergeNodesBySelector,
  ifOperationEqual,
  transformDeclsByOperations
} = require('./utilities/helper.js')

const {
  addComparatorFnToSelectors,
  getNodesBySelectors,
  getSelectors,
  selectorsLens
} = require('./utilities/selectors.js')

const {
  addComparatorFnToDecls,
  getDeclsByPropAndValue,
  getDecls,
  getNewDecl
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

  const transformDecls = (transformation) => (obj) => R.pipe(
    getDecls,
    R.map(
      R.pipe(
        getNewDecl,
        transformDeclsByOperations(obj)
      )
    )
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
            transformDecls(transformation)
          )
        )(node)
      })
    )(validatedTransformations)
  }
})
