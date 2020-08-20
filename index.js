const postcss = require('postcss')
const R = require('ramda')

const {
  transformDeclaration,
  isMatchingDecl,
  parseDecl,
  listDeclData,
  isArray,
  isRegExp,
  isBoolean,
  isString,
  getDeclData,
  isPlaceholderVariable
} = require('./utilities/helper.js')

module.exports = postcss.plugin('postcss-sparrow', ({
  transformations,
  silentConsole,
  placeholderPattern
}) => {
  const options = {
    transformations: isArray(transformations) || [],
    placeholderPattern: isRegExp(placeholderPattern) || /^\$\(\w*\)/g
  }

  // const validatedTransformations = R.filter(
  //   R.where({
  //
  //     operation: isString,
  //     values: isArray,
  //     isInclude: isBoolean
  //   })
  // )(options.transformations)

  const validatedTransformations = R.filter(
    R.where({
      selectors: isArray,
      inclusion: isBoolean
    })
  )(options.transformations)

  return (root, result) => {
    const groupBySelector = R.groupBy(R.prop('selector'))

    // const mergeBySelector = R.map(R.reduce()())
    const concatValues = (k, l, r) => k === 'nodes' ? R.concat(l, r) : r

    const mergeObjects = R.reduce(R.mergeDeepWithKey(concatValues), R.head)

    const mergedNodeList = R.pipe(
      groupBySelector,
      R.map(mergeObjects)
      // R.values
    )(root.nodes)

    const parseSelector = getDeclData('parent.selector')
    const parseProp = getDeclData('prop')
    const parseValue = getDeclData('value')

    // const hasSelector = R.has(R.__, mergedNodeList)
    const hasSelector = R.has('selectors')

    // Method 1: Separate targeted selector
    const pickMatching = (list) => (isInclude) => (v, k) => R.pipe(
      R.either(R.includes(k), R.includes('*')),
      R.equals(isInclude)
    )(list)

    const matchingSelectorList = R.pipe(
      R.map(({ selectors, inclusion }) => R.pickBy(
        pickMatching(selectors)(inclusion), mergedNodeList))
    )(validatedTransformations)

    console.log(matchingSelectorList)

    // console.log(matchingSelectorList) // Other irralevent object has been removed. Best solution should be only changing the required object

    // Method 2: Target selectors without separation
    const selectorLensLists = R.map(({ selectors, inclusion }) => {
      return R.map((selector) => {
        return R.lensPath([selector, 'nodes'])
      })(selectors)
    })(validatedTransformations)

    // Hard code lensPath

    // console.log(R.view(
    //   R.lensPath(['body', 'nodes']),
    //   mergedNodeList
    // ))
    //
    //
    //

    // TODO: Create an array of lens -> use reduce to use those lens to transform the mergedNodeList -> Turn merged nodes back to arrays

    const transformedNodeList = R.values(mergedNodeList)

    // console.log(selectorList)
    // console.log(validatedTransformations)

    // const matchingSelectorList = R.pipe(
    //   R.pickBy(pickMatchingSelector)
    // )(mergedNodeList)
    //
    // console.log(matchingSelectorList)

    // const matchingSelectorList = R.pipe(
    //   R.pickBy(R.map(hasSelector, selectorList))
    // )(mergedNodeList)
    //

    // This mutation is deliberate, as PostCSS doesn't provide an immutable API
    root.nodes = transformedNodeList
  }
})
