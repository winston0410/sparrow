const postcss = require('postcss')

const {
  isPlaceholderVariable,
  transformDeclaration,
  isMatchingDecl,
  convertPlaceholdersToValues,
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

          const targetDecl = postcss
            .parse(target, {
              from: undefined
            })
            .first.first

          const declDataList = [decl.parent.selector, decl.prop, decl.value]
          const targetDeclDataList = [targetDecl.parent.selector, targetDecl.prop, targetDecl.value]

          // If two arrays match, run transformation
          if (isMatchingDecl(declDataList, targetDeclDataList)) {
            // console.log(decl)

            transformDeclaration({ decl: decl, newDecl: transformation.transformationOption })

            transformation.transformationOption.forEach((item) => {

            })

            // Revert placeholder here to value's in decl
            // transformDeclaration({
            //   decl: decl,
            //   // Convert item into array with same data order as declDataList
            //   newDecl: convertPlaceholdersToValues(declDataList, item)
            // })
          }
        })
      })
    })
  }
})
