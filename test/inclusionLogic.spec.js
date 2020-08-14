const postcss = require('postcss')
const sparrow = require('../index.js')
const {
  isMatchingDecl,
  parseDecl,
  convertPlaceholdersToValues,
  listDeclData
} = require('../utilities/helper.js')
const R = require('ramda')

const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-match'))
chai.use(require('chai-arrays'))

describe('Test sparrow', function () {
  let css, beforeTransformation, afterTransformation, declarationTemplate

  beforeEach(function () {
    css = `p #hello{
      font-size: 18px;
      margin: rfs(10rem);
    }

    body{
      padding: 5px;
    }

    a{
      font-size: 20px;
    }

    p #hello{
      color: red
    }`

    beforeTransformation = []
    afterTransformation = []

    postcss
      .parse(css, {
        from: undefined
      })
      .walkDecls((decl) => {
        beforeTransformation.push([decl.parent.selector, decl.prop, decl.value])
      })
  })

  describe('if operation is remove', function () {
    it('should remove the target declaration', async function () {
      const options = {
        transformationList: [{
          targets: ['a{font-size: 20px}'], // css declaration with fill varible
          transformationOption: [{
            operation: 'remove' // append, prepend, insertBefore, insertAfter, replace
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

      options.transformationList.forEach((transformation, index) => {
        transformation.targets.forEach((target, index) => {
          const targetDeclData = R.pipe(parseDecl, listDeclData)(target)

          // Expect target cannot be found in trasnformedData
          expect(isMatchingDecl(afterTransformation[index], targetDeclData)).to.be.false
        })
      })
    })
  })

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
          const targetDeclData = R.pipe(parseDecl, listDeclData)(target)

          if (isMatchingDecl(beforeTransformation[index], targetDeclData)) {
            expect(isMatchingDecl(beforeTransformation[index], targetDeclData)).to.be.true
            // Check if value of the same index in the afterTransformation array equals to replacementValue

            transformationOption.forEach(({ values, operation }) => {
              values.forEach((value) => {
                expect(isMatchingDecl(afterTransformation[index], R.pipe(parseDecl, listDeclData)(value))).to.be.true
              })
            })
          }
        })
      })
    })
  })

  describe('if operation is before', function () {
    it('should insert a declaration before target declaration', async function () {
      const options = {
        transformationList: [{
          targets: ['$(a){font-size: $(a)}'], // css declaration with fill varible
          transformationOption: [{
            values: ['$(a){display: none}'],
            operation: 'before' // append, prepend, insertBefore, insertAfter, replace
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
          const targetDeclData = R.pipe(parseDecl, listDeclData)(target)

          if (isMatchingDecl(beforeTransformation[index], targetDeclData)) {
            expect(isMatchingDecl(beforeTransformation[index], targetDeclData)).to.be.true
            // Check if the length of afterTransformation array has increased
            transformationOption.forEach(({ values, operation }) => {
              values.forEach((value) => {
                const appendedValue = convertPlaceholdersToValues({ decl: beforeTransformation[index], newDecl: R.pipe(parseDecl, listDeclData)(value) })

                // expect(afterTransformation).to.be.containing(appendedValue)
              })
            })
          }
        })
      })
    })
  })

  describe('if operation is after', function () {
    it('should insert a declaration after target declaration', async function () {
      const options = {
        transformationList: [{
          targets: ['$(a){font-size: $(a)}'], // css declaration with fill varible
          transformationOption: [{
            values: ['$(a){display: none}'],
            operation: 'before' // append, prepend, insertBefore, insertAfter, replace
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
          const targetDeclData = R.pipe(parseDecl, listDeclData)(target)

          if (isMatchingDecl(beforeTransformation[index], targetDeclData)) {
            expect(isMatchingDecl(beforeTransformation[index], targetDeclData)).to.be.true
            // Check if the length of afterTransformation array has increased
            expect(beforeTransformation.length).to.not.equal(afterTransformation.length)

            transformationOption.forEach(({ values, operation }) => {
              values.forEach((value) => {
                const appendedValue = convertPlaceholdersToValues({ decl: beforeTransformation[index], newDecl: R.pipe(parseDecl, listDeclData)(value) })

                // expect(afterTransformation).to.include(appendedValue)
              })
            })
          }
        })
      })
    })
  })
})
