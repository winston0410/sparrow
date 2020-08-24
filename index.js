const postcss = require('postcss')
const R = require('ramda')

const {
  isArray,
  isRegExp,
  isBoolean,
  isString,
  mergeNodesBySelector
} = require('./utilities/helper.js')

module.exports = postcss.plugin('postcss-sparrow', ({
  transformations,
  silentConsole,
  placeholderPattern
}) => {
  const options = {
    transformations: R.defaultTo([])(transformations),
    placeholderPattern: R.defaultTo(/^\$\(\w*\)/g)(placeholderPattern)
  }

  const hasWildCard = R.includes('*')
  const selectorsLens = R.lensProp('selectors')

  const validatedTransformations = R.pipe(
    R.filter(
      R.where({
        selectors: isArray,
        inclusion: isBoolean,
        decls: isArray
      })
    )
  )(options.transformations)

  return (root, result) => {
    const mergedNodeList = R.pipe(
      mergeNodesBySelector,
      R.values
    )(root.nodes)

    const shouldIncludeOrExclude = R.ifElse(
      R.propEq('inclusion', true)
    )

    const getSelectors = R.prop('selectors')

    const isSelectorEqual = R.propEq('selector')
    const isSelectorNotEqual = R.complement(isSelectorEqual)
    const isPropEqual = R.propEq('prop')
    const isValueEqual = R.propEq('value')

    const notEqualNegativeOne = R.complement(R.equals)(-1)

    const filterNegativeResult = R.filter(
      notEqualNegativeOne
    )

    const ifMatchingResultFound = R.when(
      notEqualNegativeOne
    )

    const getNodesBySelectors = (obj) => R.map(
      R.pipe(
        shouldIncludeOrExclude(
          isSelectorEqual,
          isSelectorNotEqual
        ),
        R.findIndex(R.__, obj), // Bug.  -1 will be passed to lensIndex, finding unrelated nodes
        ifMatchingResultFound(
          R.pipe(
            R.lensIndex,
            R.view(R.__, obj)
          )
        )
      )
    )

    const getNodesToTransform = (list) => (obj) => R.map(
      R.pipe(
        getSelectors,
        getNodesBySelectors(obj),
        R.tap(console.log),
        filterNegativeResult
      )
    )(list)

    const getDeclsToTransform = (list) => (obj) => R.map(
      shouldIncludeOrExclude(
        R.pipe(
          R.tap(console.log)
        ),
        R.pipe(
          R.tap(console.log)
        )
      )
    )(list)

    const transformedNodeList = R.pipe(
      mergeNodesBySelector,
      R.values,
      getNodesToTransform(validatedTransformations)

    )(root.nodes)

    // root.nodes = transformedNodeList
  }
})
