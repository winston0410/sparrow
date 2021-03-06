const postcss = require('postcss')
const sparrow = require('../src/index.js')
const R = require('ramda')
const chai = require('chai')
const sinon = require('sinon')
const expect = chai.expect

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

  afterEach(function () {
    sinon.restore()
  })

  describe('if wildcard is used as selector', function () {
    describe('if inclusion is set to true', function () {
      it('should select and return all declarations', async function () {
        const spy = sinon.spy()
        const targetSelectors = ['*']

        const options = {
          declarations: [
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

        const declAmount = R.reduce(
          (acc, value) => R.pipe(
            R.prop('nodes'),
            R.prop('length'),
            R.add(acc)
          )(value)
        )(0)(result.root.nodes)

        expect(spy.callCount).to.equal(declAmount)
      })
    })

    describe('if inclusion is set to false', function () {
      it('should not select any declarations', async function () {
        const spy = sinon.spy()

        const options = {
          declarations: [
            {
              selectors: ['*'],
              inclusion: false,
              callbacks: [
                (x) => {
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

        expect(spy.called).to.be.false
      })
    })
  })
})
