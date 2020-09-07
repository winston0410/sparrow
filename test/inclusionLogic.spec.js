const postcss = require('postcss')
const sparrow = require('../src/index.js')
const {
  isMatchingDecl,
  parseDecl,
  convertPlaceholdersToValues,
  listDeclData
} = require('../src/utilities/helper.js')

const {
  addComparatorFnToSelectors,
  getNodesBySelectors,
  getSelectors,
  selectorsLens
} = require('../src/utilities/selectors.js')

const {
  addComparatorFnToDecls,
  getDeclsByPropAndValue,
  getDecls,
  getNewDecl
} = require('../src/utilities/decls.js')

const R = require('ramda')
const chai = require('chai')
const expect = chai.expect
chai.use(require('chai-match'))
chai.use(require('chai-arrays'))

describe('Test sparrow', function () {
  let css

  beforeEach(function () {
    css = `
    body{
      padding: 5px;
      font-weight: 400;
      font-family: "PingFangTC-Semibold"
    }

    a{
      color: #be132d;
    }`

    postcss
      .parse(css, {
        from: undefined
      })
      .walkDecls((decl) => {
        console.log(decl)
      })
  })

  describe('if wildcard is used as selector and inclusion is set to true', function () {
    it('should select and return all declarations', async function () {
      const options = {
        transformations: [
          {
            selectors: ['*'],
            inclusion: true,
            callback: () => {

            }
          }
        ]
      }

      const result = await postcss([
        sparrow(options)
      ])
        .process(css, {
          from: undefined
        })

      console.log(result)
    })
  })

  // describe('if operation is remove', function () {
  //   it('should remove the target declaration', async function () {
  //     const options = {
  //       transformations: [
  //         {
  //           selectors: ['*'],
  //           inclusion: true,
  //           decls: [{
  //             prop: 'font-family',
  //             value: '"PingFangTC-Semibold"',
  //             inclusion: true,
  //             newDecl: {
  //               prop: 'font-family',
  //               value: 'san-serif',
  //               operation: 'replace'
  //             }
  //           }]
  //         }
  //       ]
  //     }
  //
  //     const validatedTransformations = R.pipe(
  //       addComparatorFnToSelectors,
  //       addComparatorFnToDecls
  //     )(options.transformations)
  //
  //     await postcss([
  //       sparrow(options)
  //     ])
  //       .process(css, {
  //         from: undefined
  //       }).then(result => {
  //         R.map(
  //           (transformation) => result.root.walkDecls((decl) => {
  //             const result =
  //               R.pipe(
  //                 R.prop('parent'),
  //                 R.allPass([
  //                   getNodesBySelectors(transformation),
  //                   getDeclsByPropAndValue(transformation)
  //                 ])
  //               )(decl)
  //
  //             expect(result).to.be.false // Which means matching decl cannot be found and has been removed
  //           })
  //         )(validatedTransformations)
  //       })
  //   })
  // })
})
