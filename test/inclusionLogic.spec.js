const postcss = require('postcss')
const sparrow = require('../index.js')

const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-match'))

describe('Test sparrow', function () {
  let css, beforeTransformation, afterTransformation, declarationTemplate

  // const result = postcss
  //   .parse('$(selector){$(prop): $(value)px;}', { from: undefined })
  //   .walkDecls((decl) => {
  //     console.log(decl)
  //   })

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
      .parse(css, { from: undefined })
      .walkDecls((decl) => {
        declarationTemplate = `${decl.parent.selector}{${decl.prop}: ${decl.value}}`

        beforeTransformation.push(
          declarationTemplate
        )
      })
  })

  describe('if operation is remove', function () {
    it('should remove the target declaration', async function () {
      const options = {
        transformationList: [
          {
            targets: ['a{font-size: 20px}'], // css declaration with fill varible
            transformationOption: [{
              operation: 'remove' // append, prepend, insertBefore, insertAfter, replace
            }]
          }
        ]
      }

      await postcss([
        sparrow(options)
      ])
        .process(css, { from: undefined }).then(result => {
          result.root.walkDecls((decl) => {
            afterTransformation.push(declarationTemplate)
          })
        })

      options.transformationList.forEach((transformation, index) => {
        transformation.targets.forEach((target) => {
          // Remove placeholder from target element
          const targetDeclData = postcss.parse(target, { from: undefined }).first.first

          // Expect target cannot be found in trasnformedData
          expect(target).to.equal(afterTransformation[index].value)
        })
      })
    })
  })

  describe('if operation is replace', function () {
    it('should replace the target declaration', function () {

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
