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

    const parseSelector = getDeclData('parent.selector')
    const parseProp = getDeclData('prop')
    const parseValue = getDeclData('value')

    const hasSelector = R.has(R.__, mergedNodes)

    validatedTransformations.forEach(({ targets }, index) => {

      //Target config object values
      // {
      //   transformations: [
      //     {
      //       selectors: ['p', 'body'],
      //       rules: [
      //         {
      //           rulesToLookFor: [],
      //           operation: 'remove'
      //         }
      //       ]
      //     }
      //   ]
      // }

      const targetSelector = parseSelector(target)

      if (hasSelector(targetSelector) || isPlaceholderVariable(targetSelector)) {
        // Run transformation here
      }
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
