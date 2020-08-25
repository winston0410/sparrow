const R = require('ramda')

const {
  shouldIncludeOrExclude,
  ifHasWildCard
} = require('./helper.js')

const selectorsLens = R.lensProp('selectors')
const getSelectors = R.prop('selectors')
const isSelectorEqual = R.propEq('selector')
const isSelectorNotEqual = R.complement(isSelectorEqual)

const addComparatorFnToSelectors = R.pipe(
  R.map(
    shouldIncludeOrExclude(
      R.over(selectorsLens, R.map(
        ifHasWildCard(
          R.T, // Always returns true to include all values with R.filter()
          isSelectorEqual
        )
      )),
      R.over(selectorsLens, R.map(
        ifHasWildCard(
          R.F, // Always returns false to exclude all values with R.filter()
          isSelectorNotEqual
        )
      ))
    )
  ),
  R.map(
    R.over(selectorsLens, R.anyPass)
  )
)

module.exports = {
  addComparatorFnToSelectors
}
