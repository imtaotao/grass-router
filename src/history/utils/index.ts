import { Location } from '../type'
import { parsePath, isAbsolute, resolvePathname } from './path'

export * from './dom'
export * from './path'

export function warning (condition: any, message: string) {
  if (condition) return
  if (typeof console !== 'undefined') {
    const text = `Warning: ${message}`
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

// 检查俩 location 是否是一样的
export function locationsAreEqual (a: Location, b: Location) {
  return (
      a.key === b.key &&
      a.hash === b.hash &&
      a.search === b.search &&
      a.pathname === b.pathname &&
      valueEqual(a.state, b.search)
  )
}

export function createLocation (
    path: string | Location,
    state: any,
    key: string,
    currrentLocation: Location,
) {
  let location: Location

  if (typeof path === 'string') {
    location = <any>parsePath(path)
    location.state = state
  } else {
    // push(location) 这种情况
    location = Object.assign({}, path)
    location.pathname = location.pathname || ''

    const completion = (key: 'search' | 'hash') => {
      const prefix = key === 'search' ? '?' : '#'
      if (location[key]) {
        if (location[key].charAt(0) !== prefix)
        location[key] = prefix + location[key]
      } else {
        location[key] = prefix
      }
    }

    // 补全 hash 和 search
    completion('hash')
    completion('search')
  }

  if (key) location.key = key

  if (currrentLocation) {
    if (!location.pathname) {
      location.pathname = currrentLocation.pathname
    } else if (!isAbsolute(location.pathname)) {
      location.pathname = resolvePathname(location.pathname, currrentLocation.pathname)
    }
  } else {
    location.pathname = location.pathname || '/'
  }

  return location
}