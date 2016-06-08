import { getType } from './type'

export const showType = (rawType) => {
  const type = getType(rawType)
  if (type)
    return type.name
  throw new Error(`unrecognized type ${type}`)
}

export const showVal = (val) => {
  return JSON.stringify(val)
}
