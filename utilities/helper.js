const postcss = require('postcss')
const R = require('ramda')
const chalk = require('chalk')

const isPlaceholderVariable = ({ value, pattern = /^\$\(\w*\)/g }) => pattern.test(value)

const listDeclData = (decl) => [decl.parent.selector, decl.prop, decl.value]

const stringifyDecl = (declArray) => `${declArray[1]}: ${declArray[2]};`

const parseDecl = (decl) => postcss.parse(decl, { from: undefined }).first.first
// Nested object deconstructuring for newDecl
const transformDeclaration = ({ decl, newDecl: { operation, values } }) => {
  const transformationDict = {
    replace: (value) => decl.replaceWith(value),
    before: (value) => decl.before(value),
    after: (value) => decl.after(value)
  }

  if (operation === 'remove') {
    decl.remove()
  }

  values.forEach((value, i) => {
    R.pipe(
      convertPlaceholdersToValues,
      stringifyDecl,
      transformationDict[operation]
    )({ decl: listDeclData(decl), newDecl: R.pipe(parseDecl, listDeclData)(value) })
  })
}

const isMatchingDecl = ({ decl, targetDecl, isInclude = true, pattern }) => (targetDecl.every((value, index) => isPlaceholderVariable({ value: value, pattern: pattern }) || value === decl[index])) === isInclude

const convertPlaceholdersToValues = ({ decl, newDecl, pattern }) => newDecl.map((value, index) => isPlaceholderVariable({ value: value, pattern: pattern }) ? decl[index] : value)

const log = (type) => (defaultValue) => (arg) => console.log(chalk.yellow(`The value of ${chalk.cyan(arg)} is not a ${chalk.cyan(type.name)}, thus it has been replaced by the default value ${chalk.cyan(defaultValue)}.`))

const isCorrectType = (type) => R.ifElse(
  R.is(type),
  R.identity,
  R.F
  // R.pipe(
  //   log(type)(defaultValue),
  //   () => R.identity(defaultValue)// Need to return default not current value here!
  // )
)

const isArray = isCorrectType(Array)
const isRegExp = isCorrectType(RegExp)
const isBoolean = isCorrectType(Boolean)
const isString = isCorrectType(String)

module.exports = {
  isPlaceholderVariable,
  transformDeclaration,
  isMatchingDecl,
  convertPlaceholdersToValues,
  parseDecl,
  listDeclData,
  isArray,
  isRegExp,
  isBoolean,
  isString
}
