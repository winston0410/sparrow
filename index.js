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
  const nodesLens = R.lensProp('nodes')

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

    const ifHasWildCard = R.ifElse(
      hasWildCard
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

    const fromNestedLoop = (fn) => R.map(
      R.map(
        fn
      )
    )

    const getNodesBySelectors = (list) => (obj) =>
      R.pipe(
        R.map(
          shouldIncludeOrExclude(
            R.over(selectorsLens, R.map(
              ifHasWildCard(
                R.T, // Always returns true to include all values with R.filter()
                isSelectorEqual
              )
            )),
            R.over(selectorsLens, R.map(
              ifHasWildCard(
                R.F, // Always returns false to exclude all values with R.filter()
                isSelectorNotEqual
              )
            ))
          )
        ),
        R.map(getSelectors), // Potential refactor: Break transform selectors array and getNodesBySelector into two functions
        R.map(R.anyPass),
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
    //

    const addComparatorFnForDecls = R.pipe(
      R.map(getDecls),
      fromNestedLoop(
        R.pipe(
          shouldIncludeOrExclude(
            R.evolve({
              prop: R.equals,
              value: R.equals
            }),
            R.evolve({
              prop: R.complement(R.equals),
              value: R.complement(R.equals)
            })
          ),
          R.pick(
            ['prop', 'value']
          )
        )
      )
    )(validatedTransformations)

    const transformedNodeList = R.pipe(
      mergeNodesBySelector,
      R.values,
      getNodesBySelectors(validatedTransformations)
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
