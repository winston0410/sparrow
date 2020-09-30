const postcss = require('postcss')
const sparrow = require('../src/index.js')
const R = require('ramda')
const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect

describe('atRule filtering', function () {
  let css

  beforeEach(function () {
    css = `
    body{
      padding: 5px;
      font-weight: 400;
      font-family: "PingFangTC-Semibold"
    }

    @media (min-width: 920px) {
      body{
        padding: 10px;
      }
    }
    `
  })

  afterEach(function () {
    sinon.restore()
  })

  describe('if wildcard is used', function () {
    describe('if inclusion is set to true', function () {
      it('should select and return all atRules', async function () {
        const spy = sinon.spy()
        const targetAtrules = ['*']

        const options = {
          atRules: [
            {
              names: targetAtrules,
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

        const declAmount = R.reduce(
          (acc, value) => R.pipe(
            R.prop('nodes'),
            R.prop('length'),
            R.add(acc)
          )(value)
        )(0)(result.root.nodes)

        // expect(spy.callCount).to.equal(declAmount)
      })
    })
  })
})
