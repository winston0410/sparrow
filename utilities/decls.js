const R = require('ramda')

const {
  shouldIncludeOrExclude,
  ifHasWildCard,
  fromNestedLoop
} = require('./helper.js')

const declsLens = R.lensProp('decls')
const getDecls = R.prop('decls')
const getNewDecl = R.prop('newDecl')
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
          R.dissoc('inclusion')
          // Rempve newDecl and apply R.where() in another function, in order to preserve data in the validatedTransformations object.
        )
      )
    )
  )
)

const getDeclsByPropAndValue = (transformation) => (obj) => R.pipe(
  getDecls,
  R.map(
    R.pipe(
      R.dissoc('newDecl'),
      R.where
    )
  ),
  R.anyPass,
  R.applyTo(obj)
)(transformation)

module.exports = {
  addComparatorFnToDecls,
  getDecls,
  getNewDecl,
  getDeclsByPropAndValue
}
