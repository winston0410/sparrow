const postcss = require('postcss')
const R = require('ramda')

const isPlaceholderVariable = (value) => /^\$\(\w*\)/g.test(value)

const listDeclData = (decl) => [decl.parent.selector, decl.prop, decl.value]

const stringifyDecl = (declArray) => `${declArray[0]}{${declArray[1]}: ${declArray[2]}}`

const parseDecl = (decl) => postcss.parse(decl, { from: undefined }).first.first

const transformDeclaration = ({ decl, newDecl }) => {
  const transformationDict = {
    replace: (value) => decl.replaceWith(value),
    before: (value) => decl.before(value),
    after: (value) => decl.after(value)
  }

  for (const [index, { operation, values }] of newDecl.entries()) {
    if (operation === 'remove') {
      decl.remove()
      continue

      // Need to check if decl exist, before decl.remove(), to prevent multiple remove operation
    }

    values.forEach((value, i) => {
      const replacedValue = convertPlaceholdersToValues({ decl: listDeclData(decl), newDecl: R.pipe(parseDecl, listDeclData)(value) })
      transformationDict[operation](stringifyDecl(replacedValue))
    })
  }
}

const isMatchingDecl = (decl, targetDecl) => targetDecl.every((value, index) => isPlaceholderVariable(value) || value === decl[index])

const convertPlaceholdersToValues = ({ decl, newDecl }) => newDecl.map((value, index) => isPlaceholderVariable(value) ? decl[index] : value)

module.exports = {
  isPlaceholderVariable,
  transformDeclaration,
  isMatchingDecl,
  convertPlaceholdersToValues,
  parseDecl,
  listDeclData
}
