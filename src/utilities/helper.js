const R = require('ramda')

const shouldIncludeOrExclude = R.ifElse(
  R.propEq('inclusion', true)
)

const hasWildCard = R.contains('*')

const ifHasWildCard = R.ifElse(
  hasWildCard
)

module.exports = {
  shouldIncludeOrExclude,
  ifHasWildCard
}
