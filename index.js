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
    addComparatorFnToDecls,
    R.tap(console.log)
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

    // const getDeclsByProp = (list) => (obj) => R.pipe(
    //   R.map(getDecls),
    //   fromNestedLoop(
    //     R.pipe(
    //       shouldIncludeOrExclude(
    //         R.evolve({
    //           prop: R.equals,
    //           value: R.equals
    //         }),
    //         R.evolve({
    //           prop: R.complement(R.equals),
    //           value: R.complement(R.equals)
    //         })
    //       ),
    //       R.pick(
    //         ['prop', 'value']
    //       ),
    //       // (decls) => fromNestedLoop(
    //       //   R.tap(console.log)
    //       // )(obj),
    //       R.tap(console.log)
    //     )
    //   )
    // )(list)

    const transformedNodeList = R.pipe(
      mergeNodesBySelector,
      R.values
      // getNodesBySelectors(validatedTransformations)
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
