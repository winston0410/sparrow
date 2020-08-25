const R = require('ramda')

const {
  shouldIncludeOrExclude,
  ifHasWildCard,
  fromNestedLoop
} = require('./helper.js')

const declsLens = R.lensProp('decls')
const getDecls = R.prop('decls')
const getProp = R.prop('prop')
const getValue = R.prop('value')

const isPropEqual = R.propEq('prop')
const isValueEqual = R.propEq('value')

const addComparatorFnToDecls = R.pipe(
  R.map(
    R.over(declsLens,
      R.map(
        R.pipe(
          shouldIncludeOrExclude(
            R.evolve({
              prop: R.equals,
              value: R.equals
            }),
            R.evolve({
              prop: R.complement(R.equals),
              value: R.complement(R.equals)
            })
          )
          // R.pick(
          //   ['prop', 'value']
          // )
        )
      )
    )
  )
)

module.exports = {
  addComparatorFnToDecls
}
