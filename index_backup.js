const postcss = require('postcss')
const R = require('ramda')

const {
  isArray,
  isRegExp,
  isBoolean,
  isString,
  fromNestedLoop,
  mergeNodesBySelector
} = require('./utilities/helper.js')

const {
  addComparatorFnToSelectors,
  getSelectors,
  selectorsLens
} = require('./utilities/selectors.js')

const {
  addComparatorFnToDecls,
  getDecls
} = require('./utilities/decls.js')

const {
  nodesLens
} = require('./utilities/nodes.js')

module.exports = postcss.plugin('postcss-sparrow', ({
  transformations,
  silentConsole,
  placeholderPattern
}) => {
  const options = {
    transformations: R.defaultTo([])(transformations),
    placeholderPattern: R.defaultTo(/^\$\(\w*\)/g)(placeholderPattern)
  }

  const validatedTransformations = R.pipe(
    R.filter(
      R.where({
        selectors: isArray,
        inclusion: isBoolean,
        decls: isArray
      })
    ),
    addComparatorFnToSelectors,
    addComparatorFnToDecls
  )(options.transformations)

  return (root, result) => {
    const mergedNodeList = R.pipe(
      mergeNodesBySelector,
      R.values
    )(root.nodes)

    // Config centric, using list as data

    const getNodesBySelectors = (list) => (obj) =>
      R.pipe(
        () => R.map(getSelectors)(list),
        R.map(R.filter(R.__, obj))
      )(obj)

    const getDeclsByPropAndValue = (list) => (obj) =>
      R.pipe(
        () => R.map(getDecls)(list),
        (list) => fromNestedLoop(
          R.pipe(
            R.view(nodesLens),
            (nodes) => fromNestedLoop(
              R.filter(R.__, nodes)
            )(list),
            R.map(R.map(R.map(R.pipe(
              // R.prop('remove')()
              // R.tap(console.log)
            ))))
          )
        )(obj)
      )(obj)

    // const transformDecls = R.pipe(
    //
    // )

    const transformedNodeList = R.pipe(
      getNodesBySelectors(validatedTransformations),
      getDeclsByPropAndValue(validatedTransformations)
      // transformDecls(validatedTransformations)

    )(mergedNodeList)

    // const mergeOriginalAndTransformed = R.curry(
    //   (original, transformed) => {
    //     console.log(original)
    //     console.log(transformed)
    //   }
    // )

    // root.nodes = transformedNodeList
  }
})
