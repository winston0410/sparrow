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

  R.lensIndex(0)

  const getNodesBySelectors = (list) => (obj) =>
    R.pipe(
      () => R.map(getSelectors)(list),
      R.map(R.applyTo(obj)),
      R.tap(console.log)
    )(obj)

  const getDeclsByPropAndValue = (list) => (obj) =>
    R.pipe(

      R.tap(console.log)

    )(list)

  return (root, result) => {
    root.walkDecls((decl) => {
      const node = decl

      return R.when(
        getNodesBySelectors(validatedTransformations),
        () => console.log('Failed to be selected')
      )(node)

      // return R.when(
      //   getNodesBySelectors(validatedTransformations),
      //   R.when(
      //     getDeclsByPropAndValue(validatedTransformations)
      //     transformDecls
      //   )
      // )(node)
    })
  }
})
