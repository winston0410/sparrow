const postcss = require('postcss')

const {
  transformDeclaration,
  isMatchingDecl,
  parseDecl
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

          const declDataList = [decl.parent.selector, decl.prop, decl.value]
          const targetDeclDataList = parseDecl(target)

          // If two arrays match, run transformation
          if (isMatchingDecl(declDataList, targetDeclDataList)) {
            transformDeclaration({ decl: decl, newDecl: transformation.transformationOption })

            transformation.transformationOption.forEach((item) => {

            })
          }
        })
      })
    })
  }
})
