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
  const declsLens = R.lensProp('decls')

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
    const getDecls = R.prop('decls')
    const getProp = R.prop('prop')
    const getValue = R.prop('value')

    const isSelectorEqual = R.propEq('selector')
    const isSelectorNotEqual = R.complement(isSelectorEqual)
    const isPropEqual = R.propEq('prop')
    const isValueEqual = R.propEq('value')

    const notEqualNegativeOne = R.complement(R.equals)(-1)

    const rejectNegativeResult = R.reject(
      R.equals(-1)
    )

    const ifMatchingResultFound = R.when(
      notEqualNegativeOne
    )

    const getNodesBySelectors = (list) => (obj) =>
      R.pipe(
        R.map(
          shouldIncludeOrExclude(
            R.over(selectorsLens, R.map(isSelectorEqual)),
            R.over(selectorsLens, R.map(isSelectorNotEqual))
          )
        ),
        R.map(getSelectors),
        R.map(R.anyPass),
        R.map(R.filter(R.__, obj))
      )(list)

    const getDeclsByProp = (list) => (obj) => R.pipe(
      R.map(getDecls),
      R.map(
        R.map(
          shouldIncludeOrExclude(
            R.evolve({
              prop: R.equals,
              value: R.equals
            }),
            R.evolve({
              prop: R.complement(R.equals),
              value: R.complement(R.equals)
            })
          )
        )
      ),
      R.tap(console.log)
    )(list)

    const transformedNodeList = R.pipe(
      mergeNodesBySelector,
      R.values,
      getNodesBySelectors(validatedTransformations),
      getDeclsByProp(validatedTransformations)

    )(root.nodes)

    // root.nodes = transformedNodeList
  }
})
