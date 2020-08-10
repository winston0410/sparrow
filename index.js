const postcss = require('postcss')

const {
  isPlaceholderVariable,
  transformDeclaration,
  isIdenticalArray
} = require('./utilities/helper.js')

module.exports = postcss.plugin('sparrow', ({
  transformationList,
  silentConsole
}) => {
  const options = {
    transformationList: transformationList || [],
    silentConsole: silentConsole || false
  }

  // Object in transformationList
  // {
  //   target: ['a{font-size: $(value)px}'], //css declaration with fill varible
  //   transformationOption: [{
  //     value: "font-size: $(value)rem",
  //     operation: 'append' //append, prepend, insertBefore, insertAfter, replace
  //   }]
  // }

  return (root, result) => {
    // Combine declaration here

    root.walkDecls((decl) => {
      options.transformationList.map((transformation) => {
        const targetDecl = postcss
          .parse(transformation.target, {
            from: undefined
          })
          .first.first

        const declDataList = [decl.parent.selector, decl.prop, decl.value]
        const targetDeclDataList = [targetDecl.parent.selector, targetDecl.prop, targetDecl.value]
          .filter((value, index, array) => {
            if (isPlaceholderVariable(value)) {
              declDataList.splice(index, 1)
              return false
            }

            return true
          })

        // If two arrays match, run transformation
        if (isIdenticalArray(declDataList, targetDeclDataList)) {
          transformation.transformationOption.forEach((item) => {
            switch (item.operation) {
              case 'remove':
                decl.remove()
                break

              case 'replace':
                item.value.forEach((rule) => {
                  decl.replaceWith(rule)
                })
                break

              case 'before':
                item.value.forEach((rule) => {
                  decl.before(rule)
                })
                break

              case 'after':
                item.value.forEach((rule) => {
                  const newDecl = postcss.parse(rule, {
                    from: undefined
                  }).first.first

                  console.log(newDecl)

                  const newDeclData = [newDecl.parent.selector, newDecl.prop, newDecl.value]
                    .filter((value) => !isPlaceholderVariable(value))

                  if (!isIdenticalArray(newDeclData, targetDeclDataList)) {
                    decl.after(rule)
                  }
                })
                break
              default:
            }
          })
        }
      })
    })
  }
})
