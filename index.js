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
  getDeclData
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
      operation: isString,
      values: isArray,
      isInclude: isBoolean
    })
  )(options.transformations)

  return (root, result) => {
    const groupBySelector = R.groupBy(R.prop('selector'))

    // const mergeBySelector = R.map(R.reduce()())
    const concatValues = (k, l, r) => k === 'nodes' ? R.concat(l, r) : r

    const mergeObjects = R.reduce(R.mergeDeepWithKey(concatValues), R.head)

    const mergedNodes = R.pipe(
      groupBySelector,
      R.map(mergeObjects)
      // R.values
    )(root.nodes)

    const getSelector = getDeclData('parent.selector')
    const getProp = getDeclData('prop')
    const getValue = getDeclData('value')
    //
    // console.log(validatedTransformations)

    validatedTransformations.forEach(({ target }) => {
      console.log(getSelector(target))
    })

    // console.log(R.map((v) => v.nodes)(mergedNodes))

    // const mergedNodes = .map(sortBySelector)

    // root.walkDecls((decl) => {
    //   const declDataList = listDeclData(decl)
    //
    //   validatedTransformations.forEach((transformation) => {
    //     // TODO: Introduce AND logic for targets
    //     const targetDeclDataList = R.pipe(parseDecl, listDeclData)(transformation.target)
    //
    //     // If two arrays match, run transformation
    //     if (isMatchingDecl({
    //       decl: declDataList,
    //       targetDecl: targetDeclDataList,
    //       isInclude: transformation.isInclude,
    //       pattern: options.placeholderPattern
    //     })) {
    //       transformDeclaration({ decl: decl, newDecl: transformation })
    //     }
    //   })
    // })
    return 'Hello'
  }
})
