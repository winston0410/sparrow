const postcss = require('postcss')

const isPlaceholderVariable = (value) => /^\$\(\w*\)/g.test(value)

const parseDecl = (decl) => {
  const parsedDecl = postcss
    .parse(decl, {
      from: undefined
    })
    .first.first

  return [parsedDecl.parent.selector, parsedDecl.prop, parsedDecl.value]
}

const transformDeclaration = ({ decl, newDecl }) => {
  console.log(newDecl)

  const transformationDict = {
    replace: (value) => decl.replaceWith(value),
    before: (value) => decl.before(value),
    after: (value) => decl.after(value)
  }

  newDecl.forEach(({ operation, values }) => {
    if (operation === 'remove') {
      decl.remove()

      // Need to continue loop here of operation equal remove

      // Need to check if decl exist, before decl.remove(), to prevent multiple remove operation
    }

    // For non remove operation

    values.forEach((value, i) => {
      const replacedValue = convertPlaceholdersToValues(value)
      transformationDict[newDecl.operation](replacedValue)
    })
  })
}

const isMatchingDecl = (decl, targetDecl) => targetDecl.every((value, index) => isPlaceholderVariable(value) || value === decl[index])

const convertPlaceholdersToValues = (value) => {
  console.log('Convert placeholder running')
  console.log(value)
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
