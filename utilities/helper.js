const postcss = require('postcss')

const isPlaceholderVariable = (value) => /^\$\(\w*\)/g.test(value)

const listDeclData = (decl) => {
  console.log(decl)
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
  // console.log(newDecl)

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

    // For non remove operation

    values.forEach((value, i) => {
      const replacedValue = convertPlaceholdersToValues({ decl: listDeclData(decl), newDecl: parseDecl(value) })
      transformationDict[newDecl.operation](replacedValue)
    })
  }
}

const isMatchingDecl = (decl, targetDecl) => targetDecl.every((value, index) => isPlaceholderVariable(value) || value === decl[index])

const convertPlaceholdersToValues = ({ decl, newDecl }) => {
  console.log('Convert placeholder running')
  console.log(decl)
  console.log(newDecl)
  // if (transformationOptions.operation === 'remove') {
  //   return transformationOptions
  // }
  //
  // console.log(declData)
  //
  // transformationOptions.values = transformationOptions.values.map((value) => {
  //   const replacementDecl = postcss
  //     .parse(value, {
  //       from: undefined
  //     })
  //     .first.first
  //
  //   const replacementDeclData = [replacementDecl.parent.selector, replacementDecl.prop, replacementDecl.value]
  //     .map((data, index) => isPlaceholderVariable(data) ? declData[index] : data)
  //
  //   return `${replacementDeclData[0]}{${replacementDeclData[1]}: ${replacementDeclData[2]}}`
  // })
  //
  // return transformationOptions
}

module.exports = {
  isPlaceholderVariable,
  transformDeclaration,
  isMatchingDecl,
  convertPlaceholdersToValues,
  parseDecl
}
