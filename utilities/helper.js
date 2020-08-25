const postcss = require('postcss')
const R = require('ramda')
const chalk = require('chalk')

const parseDecl = (decl) => postcss.parse(decl, { from: undefined }).first.first

const getDeclData = (data) => (decl) => {
  const lens = R.lensPath(data.split('.'))
  return R.view(lens)(parseDecl(decl))
}

const parseSelector = getDeclData('parent.selector')
const parseProp = getDeclData('prop')
const parseValue = getDeclData('value')

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

module.exports = {
  parseDecl,
  isArray,
  isRegExp,
  isBoolean,
  isString,
  getDeclData,
  mergeNodesBySelector,
  shouldIncludeOrExclude,
  ifHasWildCard,
  fromNestedLoop
}
