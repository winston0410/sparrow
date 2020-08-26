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
              prop: ifHasWildCard(
                R.T,
                R.equals
              ),
              value: ifHasWildCard(
                R.T,
                R.equals
              )
            }),
            R.evolve({
              prop: ifHasWildCard(
                R.F,
                R.complement(R.equals)
              ),
              value: ifHasWildCard(
                R.F,
                R.complement(R.equals)
              )
            })
          ),
          // R.dissoc('inclusion'),
          R.omit(['inclusion', 'newDecl']), // Needs to remove newDecl for using whole object with R.where()
          R.where
        )
      )
    )
  )
)

module.exports = {
  addComparatorFnToDecls,
  getDecls
}
