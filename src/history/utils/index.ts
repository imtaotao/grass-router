export * from './path'

export function warning (condition: any, message: string): void {
  if (condition) return
  if (typeof console !== 'undefined') {
    const text: string = `Warning: ${message}`
    console.warn(text)
  }
}

export function assertParams (path: string | any, state?: Object) {
  warning(
    !(
      typeof path === 'object' &&
      path.state !== undefined &&
      state !== undefined
    ),
    'You should avoid providing a 2nd state argument to push when the 1st ' +
      'argument is a location-like object that already has state; it is ignored'
  )
}

export function valueEqual (a: any, b: any) : boolean {
  if (a === b) return true
  if (a == null || b == null) return false

  // 如果是数组
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return false
    return a.every((item, i) => valueEqual(item, b[i]))
  }

  // 如果是对象
  if (typeof a === 'object' || typeof b === 'object') {
    const aVal = a.valueOf ? a.valueOf() : Object.prototype.valueOf.call(a)
    const bVal = b.valueOf ? b.valueOf() : Object.prototype.valueOf.call(b)

    if (aVal !== a || bVal !== b) {
      return valueEqual(aVal, bVal)
    }

    // 对每个 item 进行比对
    const keys = Object.keys(Object.assign({}, a, b))
    return keys.every(key => valueEqual(a[key], b[key]))
  }

  return false
}