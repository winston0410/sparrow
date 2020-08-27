const postcss = require('postcss')
const sparrow = require('../index.js')
const {
  isMatchingDecl,
  parseDecl,
  convertPlaceholdersToValues,
  listDeclData
} = require('../utilities/helper.js')

const {
  addComparatorFnToSelectors,
  getNodesBySelectors,
  getSelectors,
  selectorsLens
} = require('../utilities/selectors.js')

const {
  addComparatorFnToDecls,
  getDeclsByPropAndValue,
  getDecls,
  getNewDecl
} = require('../utilities/decls.js')

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
    }

    a{
      color: #be132d;
    }`
  })

  describe('if operation is remove', function () {
    it('should remove the target declaration', async function () {
      const options = {
        transformations: [
          {
            selectors: ['p', 'body'],
            inclusion: true,
            decls: [{
              prop: 'padding',
              value: '5px',
              inclusion: true,
              newDecl: {
                prop: 'padding',
                value: '5px',
                operation: 'remove'
              }
            }]
          }
        ]
      }

      const validatedTransformations = R.pipe(
        addComparatorFnToSelectors,
        addComparatorFnToDecls
      )(options.transformations)

      await postcss([
        sparrow(options)
      ])
        .process(css, {
          from: undefined
        }).then(result => {
          R.map(
            (transformation) => result.root.walkDecls((decl) => {
              const result = R.ifElse(
                R.pipe(
                  R.prop('parent'),
                  getNodesBySelectors(transformation),
                  getDeclsByPropAndValue(transformation)
                ),
                R.T,
                R.F
              )(decl)

              expect(result).to.be.false // Which means matching decl cannot be found and has been removed
            })
          )(validatedTransformations)
        })
    })
  })

  // describe('if operation is replace', function () {
  //   it('should replace the target declaration', async function () {
  //     const options = {
  //       transformations: [{
  //         target: '$(a){font-size: $(a)}', // css declaration with fill varible
  //         values: ['$(a){display: none}'],
  //         operation: 'replace', // append, prepend, insertBefore, insertAfter, replace
  //         isInclude: true
  //       }]
  //     }
  //
  //     await postcss([
  //       sparrow(options)
  //     ])
  //       .process(css, {
  //         from: undefined
  //       }).then(result => {
  //         result.root.walkDecls((decl) => {
  //           afterTransformation.push([decl.parent.selector, decl.prop, decl.value])
  //         })
  //       })
  //
  //     options.transformations.forEach(({ target, values, isInclude }, index) => {
  //       const targetDeclData = R.pipe(parseDecl, listDeclData)(target)
  //
  //       if (isMatchingDecl({ decl: beforeTransformation[index], targetDecl: targetDeclData, isInclude: isInclude })) {
  //         expect(isMatchingDecl({
  //           decl: beforeTransformation[index],
  //           targetDecl: targetDeclData,
  //           isInclude: isInclude
  //         })).to.equal(isInclude)
  //         // Check if value of the same index in the afterTransformation array equals to replacementValue
  //
  //         values.forEach((value) => {
  //           expect(isMatchingDecl({
  //             decl: afterTransformation[index],
  //             targetDecl: R.pipe(parseDecl, listDeclData)(value),
  //             isInclude: isInclude
  //           })).to.equal(isInclude)
  //         })
  //       }
  //     })
  //   })
  // })
  //
  // describe('if operation is before', function () {
  //   it('should insert a declaration before target declaration', async function () {
  //     const options = {
  //       transformations: [{
  //         target: '$(a){font-size: $(a)}', // css declaration with fill varible
  //         values: ['$(a){display: none}'],
  //         operation: 'before', // append, prepend, insertBefore, insertAfter, replace
  //         isInclude: true
  //       }]
  //     }
  //
  //     await postcss([
  //       sparrow(options)
  //     ])
  //       .process(css, {
  //         from: undefined
  //       }).then(result => {
  //         result.root.walkDecls((decl) => {
  //           afterTransformation.push([decl.parent.selector, decl.prop, decl.value])
  //         })
  //       })
  //
  //     options.transformations.forEach(({ target, values, isInclude }, index) => {
  //       const targetDeclData = R.pipe(parseDecl, listDeclData)(target)
  //
  //       if (isMatchingDecl({ decl: beforeTransformation[index], targetDecl: targetDeclData, isInclude: isInclude })) {
  //         expect(isMatchingDecl({
  //           decl: beforeTransformation[index],
  //           targetDecl: targetDeclData,
  //           isInclude: isInclude
  //         })).to.equal(isInclude)
  //         // Check if value of the same index in the afterTransformation array equals to replacementValue
  //         values.forEach((value) => {
  //           const newDecl = convertPlaceholdersToValues({
  //             decl: beforeTransformation[index],
  //             newDecl: R.pipe(parseDecl, listDeclData)(value)
  //           })
  //
  //           expect(afterTransformation).to.include.deep.members([newDecl])
  //         })
  //       }
  //     })
  //   })
  // })
  //
  // describe('if operation is after', function () {
  //   it('should insert a declaration before target declaration', async function () {
  //     const options = {
  //       transformations: [{
  //         target: '$(a){font-size: $(a)}', // css declaration with fill varible
  //         values: ['$(a){display: block}'],
  //         operation: 'after', // append, prepend, insertBefore, insertAfter, replace
  //         isInclude: true
  //       }]
  //     }
  //
  //     await postcss([
  //       sparrow(options)
  //     ])
  //       .process(css, {
  //         from: undefined
  //       }).then(result => {
  //         result.root.walkDecls((decl) => {
  //           afterTransformation.push([decl.parent.selector, decl.prop, decl.value])
  //         })
  //       })
  //
  //     options.transformations.forEach(({ target, values, isInclude }, index) => {
  //       const targetDeclData = R.pipe(parseDecl, listDeclData)(target)
  //
  //       if (isMatchingDecl({ decl: beforeTransformation[index], targetDecl: targetDeclData, isInclude: isInclude })) {
  //         expect(isMatchingDecl({
  //           decl: beforeTransformation[index],
  //           targetDecl: targetDeclData,
  //           isInclude: isInclude
  //         })).to.equal(isInclude)
  //         // Check if value of the same index in the afterTransformation array equals to replacementValue
  //         values.forEach((value) => {
  //           const newDecl = convertPlaceholdersToValues({
  //             decl: beforeTransformation[index],
  //             newDecl: R.pipe(parseDecl, listDeclData)(value)
  //           })
  //
  //           expect(afterTransformation).to.include.deep.members([newDecl])
  //         })
  //       }
  //     })
  //   })
  // })
})
