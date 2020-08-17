const postcss = require('postcss')
const R = require('ramda')

const {
  transformDeclaration,
  isMatchingDecl,
  parseDecl,
  listDeclData,
  isCorrectType
} = require('./utilities/helper.js')

module.exports = postcss.plugin('postcss-sparrow', ({
  transformations,
  silentConsole,
  placeholderPattern
}) => {
  const isArray = isCorrectType(Array)([])
  const isRegExp = isCorrectType(RegExp)(/^\$\(\w*\)/g)
  // const isBoolean =

  const options = {
    transformations: isArray(transformations),
    placeholderPattern: isRegExp(placeholderPattern)
  }

  // const validatedTransformations = R.filter(
  //   R.where({
  //
  //   })
  // )(options.transformations)

  return (root, result) => {
    root.walkDecls((decl) => {
      const declDataList = listDeclData(decl)

      options.transformations.forEach((transformation) => {
        // Check if placeholder is missed.  Fill in if needed
        const targetDeclDataList = R.pipe(parseDecl, listDeclData)(transformation.target)

        // If two arrays match, run transformation
        if (isMatchingDecl({
          decl: declDataList,
          targetDecl: targetDeclDataList,
          isInclude: transformation.isInclude,
          pattern: options.placeholderPattern
        })) {
          transformDeclaration({ decl: decl, newDecl: transformation })
        }
      })
    })
  }
})
