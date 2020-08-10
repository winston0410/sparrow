const chalk = require('chalk')
const postcss = require('postcss')

const isPlaceholderVariable = (value) => /^\$\(\w*\)/g.test(value)

const log = (msg, msgType, silentConsole) => {
  if (silentConsole === true) {
    return
  }

  switch (msgType) {
    case 'success':
      console.log(chalk.green(msg))
      break

    case 'notice':
      console.log(chalk.cyan(msg))
      break

    case 'error':
      console.log(chalk.red(msg))
      break
    default:
  }
}

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

module.exports = {
  isPlaceholderVariable,
  transformDeclaration,
  isIdenticalArray
}
