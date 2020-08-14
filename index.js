const postcss = require('postcss')
const R = require('ramda')

const {
  transformDeclaration,
  isMatchingDecl,
  parseDecl,
  listDeclData
} = require('./utilities/helper.js')

module.exports = postcss.plugin('sparrow', ({
  transformationList,
  silentConsole
}) => {
  const options = {
    transformationList: transformationList || [],
    silentConsole: silentConsole || false
  }

  return (root, result) => {
    root.walkDecls((decl) => {
      options.transformationList.forEach((transformation) => {
        transformation.targets.forEach((target) => {
          // Check if placeholder is missed.  Fill in if needed

          const declDataList = listDeclData(decl)
          const targetDeclDataList = R.pipe(parseDecl, listDeclData)(target)

          // If two arrays match, run transformation
          if (isMatchingDecl(declDataList, targetDeclDataList)) {
            transformDeclaration({ decl: decl, newDecl: transformation.transformationOption })
          }
        })
      })
    })
  }
})
