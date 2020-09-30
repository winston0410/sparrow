const R = require('ramda')

const isCorrectType = (type) => R.is(type)

const isArray = isCorrectType(Array)
const isRegExp = isCorrectType(RegExp)
const isBoolean = isCorrectType(Boolean)
const isString = isCorrectType(String)

const shouldIncludeOrExclude = R.ifElse(
  R.propEq('inclusion', true)
)

const hasWildCard = R.contains('*')

const ifHasWildCard = R.ifElse(
  hasWildCard
)

module.exports = {
  isArray,
  isRegExp,
  isBoolean,
  isString,
  shouldIncludeOrExclude,
  ifHasWildCard
}
