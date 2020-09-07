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
  })

  describe('if wildcard is used as selector', function () {
    describe('if inclusion is set to true', function () {
      it('should select and return all declarations', async function () {
        const options = {
          transformations: [
            {
              selectors: ['body'],
              inclusion: true,
              callback: (x) => {
                console.log('hello world')
              }
            }
          ]
        }

        const result = await postcss([
          sparrow(options)
        ])
          .process(css, {
            from: undefined
          })// Need to get all decls in an array
        // Use root.walkDecls

        // console.log(result)
      })
    })

    describe('if inclusion is set to false', function () {
      it('should not select any declarations', async function () {
        const options = {
          transformations: [
            {
              selectors: ['*'],
              inclusion: false,
              callback: (x) => {
                // Do transformation here
              }
            }
          ]
        }
      })
    })
  })
})
