export const RUNTYPE_TYPE = Symbol('runtype type')
export const RUNTYPE_VALUE = Symbol('runtype value')

const primitives = [
  {
    type: Boolean,
    name: 'Boolean',
    typeOf: 'boolean'
  },
  {
    type: Number,
    name: 'Number',
    typeOf: 'number'
  },
  {
    type: String,
    name: 'String',
    typeOf: 'string'
  }
]

const primByType = new Map()
const primByTypeOf = new Map()

for (let i = 0; i < primitives.length; i++) {
  const prim = primitives[i]
  primByType.set(prim.type, prim)
  primByTypeOf.set(prim.typeOf, prim)
}

const boxPrimitive = typ => {
  const prim = primByType.get(typ)
  if (!prim)
    return undefined

  return {
    [RUNTYPE_TYPE]: true,
    check: val => typeof val === prim.typeOf,
    name: prim.name,
    show: val => prim.typeOf == 'string' ? `'${val}'` : String(val)
  }
}

export const inferType = val => RUNTYPE_VALUE in val ? val[RUNTYPE_VALUE] : primByTypeOf.get(typeof val)

export const getType = rawType => RUNTYPE_TYPE in rawType ? rawType : boxPrimitive(rawType)

export const showType = (rawType) => {
  const type = getType(rawType)
  if (type)
    return type.name
  throw new Error(`unrecognized type ${type}`)
}

export const val => {
  const type = getType(rawType)
  if (type)
    return type.show(val)
  throw new Error(`unrecognized type ${type}`)
}
