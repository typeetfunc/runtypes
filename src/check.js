import {
  errNoNullOrUndefined,
  errWrongType
} from './messages'

import {
  getPrimTypeChecker
} from './primitives'

import { showVal } from './show'

const wrapChecker = checker => checker && (val) => {
  if (val === null || val === undefined)
    return errNoNullOrUndefined
  checker(val)
}

export const getTypeChecker =
  typ => {
    const prim = getPrimTypeChecker(type)
    if (prim)
      return prim
    else if (type._isRuntype)
      return type
    return undefined
  }
