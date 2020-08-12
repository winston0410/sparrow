const postcss = require('postcss')
const sparrow = require('../index.js')
const {
  isMatchingDecl
} = require('../utilities/helper.js')

const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-match'))

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
          const targetDecl = postcss.parse(target, {
            from: undefined
          }).first.first

          const targetDeclData = [targetDecl.parent.selector, targetDecl.prop, targetDecl.value]

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

      options.transformationList.forEach((transformation, index) => {
        transformation.targets.forEach((target, index) => {
          const targetDecl = postcss.parse(target, {
            from: undefined
          }).first.first

          const targetDeclData = [targetDecl.parent.selector, targetDecl.prop, targetDecl.value]

          // console.log(beforeTransformation)
          //
          // console.log(targetDeclData)

          console.log(afterTransformation)

          // Expect target cannot be found in transformedData
          expect(isMatchingDecl(afterTransformation[index], targetDeclData)).to.be.false
          // Expect replacement value to be found in transformedData
          expect(isMatchingDecl(afterTransformation[index], targetDeclData)).to.be.true
        })
      })
    })
  })

  describe('if operation is before', function () {
    it('should insert a declaration before target declaration', function () {

    })
  })

  describe('if operation is after', function () {
    it('should insert a declaration after target declaration', function () {

    })
  })
})
