const postcss = require('postcss')
const R = require('ramda')

const {
  transformDeclaration,
  isMatchingDecl,
  parseDecl,
  listDeclData
} = require('./utilities/helper.js')

module.exports = postcss.plugin('postcss-sparrow', ({
  transformations,
  silentConsole,
  placeholderPattern
}) => {
  const options = {
    transformations: transformations || [],
    silentConsole: silentConsole || false,
    placeholderPattern: placeholderPattern || /^\$\(\w*\)/g
  }

  return (root, result) => {
    root.walkDecls((decl) => {
      options.transformations.forEach((transformation) => {
        // Check if placeholder is missed.  Fill in if needed

        const declDataList = listDeclData(decl)
        const targetDeclDataList = R.pipe(parseDecl, listDeclData)(transformation.target)

        // If two arrays match, run transformation
        if (isMatchingDecl({ decl: declDataList, targetDecl: targetDeclDataList, isInclude: transformation.isInclude })) {
          transformDeclaration({ decl: decl, newDecl: transformation })
        }
      })
    })
  }
})
