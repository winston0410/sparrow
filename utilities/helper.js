const postcss = require('postcss')
const R = require('ramda')

const isPlaceholderVariable = ({ value, pattern = /^\$\(\w*\)/g }) => pattern.test(value)

const listDeclData = (decl) => [decl.parent.selector, decl.prop, decl.value]

const stringifyDecl = (declArray) => `${declArray[1]}: ${declArray[2]};`

const parseDecl = (decl) => postcss.parse(decl, { from: undefined }).first.first
// Nested object deconstructuring for newDecl
const transformDeclaration = ({ decl, newDecl: { operation, values } }) => {
  const transformationDict = {
    replace: (value) => decl.replaceWith(value),
    before: (value) => decl.before(value),
    after: (value) => decl.after(value)
  }

  if (operation === 'remove') {
    decl.remove()
  }

  values.forEach((value, i) => {
    R.pipe(
      convertPlaceholdersToValues,
      stringifyDecl,
      transformationDict[operation]
    )({ decl: listDeclData(decl), newDecl: R.pipe(parseDecl, listDeclData)(value) })
  })
}

const isMatchingDecl = ({ decl, targetDecl, isInclude = true, pattern }) => (targetDecl.every((value, index) => isPlaceholderVariable({ value: value, pattern: pattern }) || value === decl[index])) === isInclude

const convertPlaceholdersToValues = ({ decl, newDecl, pattern }) => newDecl.map((value, index) => isPlaceholderVariable({ value: value, pattern: pattern }) ? decl[index] : value)

module.exports = {
  isPlaceholderVariable,
  transformDeclaration,
  isMatchingDecl,
  convertPlaceholdersToValues,
  parseDecl,
  listDeclData
}
