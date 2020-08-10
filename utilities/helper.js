const postcss = require('postcss')

const isPlaceholderVariable = (value) => /^\$\(\w*\)/g.test(value)

// const hasMatchingTarget = (decl, targetDecl) => {
//   const declDataList = [decl.parent.selector, decl.prop, decl.value]
//   const targetDeclDataList = [targetDecl.parent.selector, targetDecl.prop, targetDecl.value]
//
//   targetDeclDataList.forEach((value, index) => {
//     if (isPlaceholderVariable(value)) {
//       // Break
//     }
//
//     if (value === declDataList[index]) {
//       // Do transformation here
//       return true
//     }
//   })
// }

const transformDeclaration = (decl, transformationDecls) => {
  transformationDecls.forEach((transformation) => {
    console.log(transformation)
    // Perform transformation
    switch (transformation.operation) {
      case 'replace':
        console.log('Replacing value')
        break
      default:
    }
  })
}
const isIdenticalArray = (declArray, targetDeclArray) => declArray.toString() === targetDeclArray.toString()

const isMatchingDecl = (decl, targetDecl) => targetDecl.every((value, index) => isPlaceholderVariable(value) || value === decl[index])

module.exports = {
  isPlaceholderVariable,
  transformDeclaration,
  isIdenticalArray,
  isMatchingDecl
}
