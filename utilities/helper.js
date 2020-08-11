const postcss = require('postcss')

const isPlaceholderVariable = (value) => /^\$\(\w*\)/g.test(value)

const transformDeclaration = ({ decl, newDecl }) => {
  if (newDecl.operation === 'remove') {
    decl.remove()
    return
  }

  const transformationDict = {
    replace: (value) => decl.replaceWith(value),
    before: (value) => decl.before(value),
    after: (value) => decl.after(value)
  }

  newDecl.values.forEach((value) => {
    transformationDict[newDecl.operation](value);
  })
}

const isMatchingDecl = (decl, targetDecl) => targetDecl.every((value, index) => isPlaceholderVariable(value) || value === decl[index])

const convertPlaceholdersToValues = (declData, replacmentDeclData) => {

  return
}

module.exports = {
  isPlaceholderVariable,
  transformDeclaration,
  isMatchingDecl,
  convertPlaceholdersToValues
}
