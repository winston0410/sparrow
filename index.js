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

  const transformDecls = () => {

  }

  const getNodesBySelectors = (transformation) => (obj) => R.pipe(
    getSelectors,
    R.applyTo(obj)
  )(transformation)

  const getDeclsByPropAndValue = (obj) =>
    R.pipe(

      R.tap(console.log)

    )

  return (root, result) => {
    R.map(
      (transformation) => root.walkDecls((decl) => {
        const node = decl

        console.log(
          R.when(
            getNodesBySelectors(transformation),
            R.identity
          )(node)
        )

        // return R.when(
        //   getNodesBySelectors(node),
        //   R.when(
        //     getDeclsByPropAndValue(node),
        //     () => console.log('The prop of this node is the targetted once')
        //   )
        // )(transformation)
      })
    )(validatedTransformations)
  }
})
