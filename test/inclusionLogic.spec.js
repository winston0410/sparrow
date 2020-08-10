const postcss = require('postcss')
const sparrow = require('../index.js')

const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-match'))

describe('Test sparrow', function () {
  let css, beforeTransformation, afterTransformation

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
        beforeTransformation.push({
          selector: decl.parent.selector,
          prop: decl.prop,
          value: decl.value
        })
      })
  })

  describe('if operation is remove', function () {
    it('should remove the target declaration', async function () {
      const options = {
        transformationList: [
          {
            target: ['$(a){font-size: 20px}'], // css declaration with fill varible
            transformationOption: [{
              value: ['font-size: 19px'],
              operation: 'after' // append, prepend, insertBefore, insertAfter, replace
            }]
          }
        ]
      }

      await postcss([
        sparrow(options)
      ])
        .process(css, { from: undefined }).then(result => {
          result.root.walkDecls((decl) => {
            afterTransformation.push({
              selector: decl.parent.selector,
              prop: decl.prop,
              value: decl.value
            })
          })
        })

      console.log(afterTransformation)

      // beforeTransformation.forEach((decl, index) => {
      //
      //     expect(decl.value).to.equal(afterTransformation[index].value)
      //
      // })
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
