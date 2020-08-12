const postcss = require('postcss')
const sparrow = require('../index.js')
const {
  isMatchingDecl,
  parseDecl
} = require('../utilities/helper.js')

describe('if operation is replace', function () {
  it('should replace the target declaration', async function () {
    const options = {
      transformationList: [{
        targets: ['$(a){font-size: $(a)}'], // css declaration with fill varible
        transformationOption: [{
          values: ['$(a){display: none}'],
          operation: 'replace' // append, prepend, insertBefore, insertAfter, replace
        }]
      }]
    }

    await postcss([
      sparrow(options)
    ])
      .process(css, {
        from: undefined
      }).then(result => {
        result.root.walkDecls((decl) => {
          afterTransformation.push([decl.parent.selector, decl.prop, decl.value])
        })
      })

    options.transformationList.forEach(({ targets, transformationOption }, index) => {
      targets.forEach((target, index) => {
        const targetDeclData = parseDecl(target)

        if (isMatchingDecl(beforeTransformation[index], targetDeclData)) {
          expect(isMatchingDecl(beforeTransformation[index], targetDeclData)).to.be.true
          // Check if value of the same index in the afterTransformation array equals to replacementValue

          transformationOption.forEach(({ values, operation }) => {
            values.forEach((value) => {
              expect(isMatchingDecl(afterTransformation[index], parseDecl(value))).to.be.true
            })
          })
        }
      })
    })
  })
})
