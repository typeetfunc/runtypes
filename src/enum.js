import {
  check,
  requireExhaustiveCases,
  disallowExtraneousCases
} from './settings'

import {
  getTypeChecker
} from './check'

import {
  errNotAType,
  errNotACtorTypeArray,
  errNumCtorArgs,
  errBadCtorArg,
  errInvalidCaseName,
  errExhaustiveness,
  errMissingCase
} from './messages'

export default (spec) => {

  const type = {}

  for (const tag in spec) {

    const paramTypes = spec[tag]

    let typeCheckers
    if (check()) {
      // Validate that the constructor was specified with an array of type params
      if (!Array.isArray(paramTypes))
        throw new TypeError(errNotACtorTypeArray(paramTypes))

      typeCheckers = new Array(paramTypes.length)
      // Validate that each param type is in fact a type
      for (let i = 0; i < paramTypes.length; i++) {
        const checker = getTypeChecker(paramTypes[i])
        if (!checker)
          throw new TypeError(errNotAType(paramType))
        typeCheckers[i] = checker
      }
    }

    type[tag] = (...args) => {

      if (check()) {
        // Num args check
        if (args.length !== paramTypes.length)
          throw new TypeError(errNumCtorArgs(paramTypes.length, args.length))

        // Per-argument validation
        for (let i = 0; i < args.length; i++) {
          const arg = args[i]
          const errMsg = typeCheckers[i](arg)
          if (errMsg)
            throw new TypeError(errBadCtorArg(arg, i, tag, errMsg))
        }
      }

      // A value of an enum type is nothing more than the case function
      // which analyzes it
      return {
        tag,
        args,
        match(cases) {
          if (check()) {
            if (disallowExtraneousCases()) {
              for (const caseName in cases) {
                if (!(caseName in spec))
                  throw new TypeError(errInvalidCaseName(caseName, Object.keys(spec)))
              }
            }

            if (requireExhaustiveCases()) {
              const missingCases = []

              for (const caseName in spec)
                if (!(caseName in cases))
                  missingCases.push(caseName)

              if (missingCases.length > 0)
                throw new TypeError(errExhaustiveness(missingCases.reverse()))
            }
          }

          const handler = cases[tag]

          if (!handler)
            throw new TypeError(errMissingCase(tag))

          return handler.apply(null, args)
        }
      }
    }
  }
  return type
}
