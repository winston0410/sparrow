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
      R.map(mergeObjects),
      R.values
    )(root.nodes)

    const parseSelector = getDeclData('parent.selector')
    const parseProp = getDeclData('prop')
    const parseValue = getDeclData('value')

    // const hasSelector = R.has(R.__, mergedNodeList)
    // const hasSelector = R.has('selectors')
    //
    //

    const hasWildCard = R.includes('*')

    // TODO find and return index for the matching object, selecting it by its 'selector' prop

    const eq = (k) => (v) => R.propEq(k)(v)
    const selectorEq = eq('selector')
    //
    // const findIndexBySelector = findIndex('selector')

    const shouldBeIncluded = ({ value, toInclude }) => R.pipe(
      R.either(
        R.includes(value),
        hasWildCard
      ),
      R.equals(toInclude)
    )

    // Method 2: Target selectors without separation
    const selectorLensLists = R.map(({ selectors, inclusion }) => {
      return R.map(R.pipe(
        R.unless(
          hasWildCard,
          R.pipe( // Run if no wild card is found

            R.tap(console.log) // Find object with matching selector
          )
        )
      ))(selectors)
    })(validatedTransformations)

    // Hard code lensPath

    // console.log(R.view(
    //   R.lensPath(['body', 'nodes']),
    //   mergedNodeList
    // ))
    //
    //
    //
    //
    //
    //
    //
    //
    //

    // TODO: Create an array of lens -> use reduce to use those lens to transform the mergedNodeList -> Turn merged nodes back to arrays

    const transformedNodeList = mergedNodeList

    // This mutation is deliberate, as PostCSS doesn't provide an immutable API
    root.nodes = transformedNodeList
  }
})
