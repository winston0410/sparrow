const postcss = require('postcss')
const R = require('ramda')
const chalk = require('chalk')

const isCorrectType = (type) => R.is(type)

const isArray = isCorrectType(Array)
const isRegExp = isCorrectType(RegExp)
const isBoolean = isCorrectType(Boolean)
const isString = isCorrectType(String)

const groupBySelector = R.groupBy(R.prop('selector'))

// const mergeBySelector = R.map(R.reduce()())
const concatValues = (k, l, r) => k === 'nodes' ? R.concat(l, r) : r

const mergeNodes = R.reduce(R.mergeDeepWithKey(concatValues), R.head)

const mergeNodesBySelector = R.pipe(
  groupBySelector,
  R.map(mergeNodes)
)

const mergeObjWithNewValues = (k, l, r) => R.when(
  k === 'nodes',
  R.always(r)
)

const shouldIncludeOrExclude = R.ifElse(
  R.propEq('inclusion', true)
)

const hasWildCard = R.includes('*')

const ifHasWildCard = R.ifElse(
  hasWildCard
)

const fromNestedLoop = (fn) => R.map(
  R.map(
    fn
  )
)

const notEqualNegativeOne = R.complement(R.equals)(-1)

const rejectNegativeResult = R.reject(
  R.equals(-1)
)

const ifMatchingResultFound = R.when(
  notEqualNegativeOne
)

const ifEmptyResult = R.ifElse(
  R.isEmpty
)

const ifOperationEqual = (operation) => R.pipe(
  R.prop('operation'),
  R.equals(operation)
)

module.exports = {
  isArray,
  isRegExp,
  isBoolean,
  isString,
  mergeNodesBySelector,
  shouldIncludeOrExclude,
  ifHasWildCard,
  fromNestedLoop,
  ifOperationEqual
}
