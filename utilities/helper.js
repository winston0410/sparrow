const postcss = require('postcss')

const isPlaceholderVariable = (value) => /^\$\(\w*\)/g.test(value)

const listDeclData = (decl) => {
  return [decl.parent.selector, decl.prop, decl.value]
}

const parseDecl = (decl) => {
  const parsedDecl = postcss
    .parse(decl, {
      from: undefined
    })
    .first.first

  return listDeclData(parsedDecl)
}

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
      const replacedValue = convertPlaceholdersToValues({ decl: listDeclData(decl), newDecl: parseDecl(value) })
      transformationDict[operation](replacedValue)
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
  parseDecl
}
