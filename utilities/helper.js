const postcss = require('postcss')

const isPlaceholderVariable = (value) => /^\$\(\w*\)/g.test(value)

const transformDeclaration = ({ decl, newDecl }) => {
  if (newDecl.operation === 'remove') {
    decl.remove()
    return
  }

  const transformationDict = {
    replace: decl.replaceWith,
    before: decl.before,
    after: decl.after
  }

  newDecl.values.forEach((value) => {
    transformationDict[newDecl.operation](value)
  })
}

const isMatchingDecl = (decl, targetDecl) => targetDecl.every((value, index) => isPlaceholderVariable(value) || value === decl[index])

module.exports = {
  isPlaceholderVariable,
  transformDeclaration,
  isMatchingDecl
}
