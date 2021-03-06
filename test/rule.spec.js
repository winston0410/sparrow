const postcss = require('postcss')
const sparrow = require('../src/index.js')
const R = require('ramda')
const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect

describe('Rule filtering', function () {
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

  afterEach(function () {
    sinon.restore()
  })

  describe('if wildcard is used', function () {
    describe('if inclusion is set to true', function () {
      it('should select and return all rules', async function () {
        const spy = sinon.spy()
        const targetSelectors = ['*']

        const options = {
          rules: [
            {
              selectors: targetSelectors,
              inclusion: true,
              callbacks: [
                (decl) => {
                  spy()
                }
              ]
            }
          ]
        }

        const result = await postcss([
          sparrow(options)
        ])
          .process(css, {
            from: undefined
          })

        const declAmount = result.root.nodes.length

        expect(spy.callCount).to.equal(declAmount)
      })
    })
  })
})
