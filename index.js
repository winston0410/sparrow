const postcss = require('postcss')
const R = require('ramda')

const {
  isArray,
  isRegExp,
  isBoolean,
  isString,
  mergeNodesBySelector
} = require('./utilities/helper.js')

const {
  addComparatorFnToSelectors,
  getSelectors
} = require('./utilities/selectors.js')

const {
  addComparatorFnToDecls
} = require('./utilities/decls.js')

module.exports = postcss.plugin('postcss-sparrow', ({
  transformations,
  silentConsole,
  placeholderPattern
}) => {
  const options = {
    transformations: R.defaultTo([])(transformations),
    placeholderPattern: R.defaultTo(/^\$\(\w*\)/g)(placeholderPattern)
  }

  const nodesLens = R.lensProp('nodes')

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

  return (root, result) => {
    const mergedNodeList = R.pipe(
      mergeNodesBySelector,
      R.values
    )(root.nodes)

    const notEqualNegativeOne = R.complement(R.equals)(-1)

    const rejectNegativeResult = R.reject(
      R.equals(-1)
    )

    const ifMatchingResultFound = R.when(
      notEqualNegativeOne
    )

    const getNodesBySelectors = (list) => (obj) =>
      R.pipe(
        R.map(getSelectors),
        R.map(R.filter(R.__, obj))
      )(list)

    const ifEmptyResult = R.ifElse(
      R.isEmpty
    )

    const transformedNodeList = R.pipe(
      mergeNodesBySelector,
      R.values,
      getNodesBySelectors(validatedTransformations),
      R.tap(console.log)
      // getDeclsByProp(validatedTransformations)

    )(root.nodes)

    // const mergeOriginalAndTransformed = R.curry(
    //   (original, transformed) => {
    //     console.log(original)
    //     console.log(transformed)
    //   }
    // )

    // root.nodes = transformedNodeList
  }
})
