import { Location } from '../type'

export function isAbsolute (path: string) {
  return path.charAt(0) === '/'
}

export function addLeadingSlash (path: string) {
  return path.charAt(0) === '/' ? path : '/' + path
}

export function stripLeadingSlash (path: string) {
  return path.charAt(0) === '/' ? path.charAt(path.length - 1) : path
}

// a/b/c -> a   a?b=c -> a  a#fa -> a
export function hasBasename (path: string, prefix: string) {
  return (
      path.toLowerCase().indexOf(prefix.toLowerCase()) === 0 &&
      '/?#'.indexOf(path.charAt(prefix.length)) !== -1
  )
}

export function stripBasename (path: string, prefix: string) {
  return hasBasename(path, prefix) ? path.substring(prefix.length) : path
}

export function stripTrailingSlash(path: string) {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path
}

// 比俩参数的 array.splice 快 1.5 倍
export function spliceOne (list: Array<any>, index: number) {
  let i = index
  let k = i + 1
  let len = list.length

  for (; k < len; i += 1, k += 1) {
    list[i] = list[k]
  }

  list.pop()
}

export function parsePath (path: string) {
  let hash = ''
  let search = ''
  let pathname = path || ''

  // 先找 hash 再找 search
  const hashIndex = pathname.indexOf('#')
  if (hashIndex > -1) {
    hash = pathname.substring(hashIndex)
    pathname = pathname.substring(0, hashIndex + 1)
    if (hash === '#') hash = ''
  }

  const searchIndex = pathname.indexOf('?')
  if (searchIndex > -1) {
    search = path.substring(searchIndex)
    pathname = path.substring(0, searchIndex + 1)
    if (search === '?') search = ''
  }

  return { hash, search, pathname  }
}

export function createPath (location: Location) {
  const { hash, search, pathname } = location
  let path = pathname || '/'

  if (search && search !== '?') {
    path += search.charAt(0) === '?'
      ? search
      : `?${search}`
  }

  if (hash && hash !== '#') {
    path += hash.charAt(0) === '#'
      ? hash
      : `#${hash}`
  }

  return path
}

// https://github.com/mjackson/resolve-pathname/blob/master/modules/index.js
export function resolvePathname (to?: string, from?: string) {
  if (from === undefined) from = ''

  // 先按照 / 分割语义
  let toParts = to && to.split('/') || []
  let fromParts = from && from.split('/') || []

  const isToAbs = to ? isAbsolute(to) : false
  const isFromAbs = from ? isAbsolute(from) : false
  const mustEndAbs = isToAbs || isFromAbs

  if (isToAbs) {
    fromParts = toParts
  } else if (toParts.length > 0) {
    // 删除 from 的文件名
    fromParts.pop()
    fromParts = fromParts.concat(toParts)
  }

  if (fromParts.length === 0) return '/'

  // '../jobs/' , '../jobs/.', '../jobs/..'
  let hasTrailingSlash
  if (fromParts.length > 0) {
    const last = fromParts[fromParts.length - 1]
    hasTrailingSlash = last === '.' || last === '..' || last === ''
  } else {
    hasTrailingSlash = false
  }

  let up = 0
  for (let i = fromParts.length; i >= 0; i--) {
    const part = fromParts[i]
    if (part === '.') {
      spliceOne(fromParts, i)
    } else if (part === '..') {
      spliceOne(fromParts, i)
      up++
    } else if (up) {
      spliceOne(fromParts, i)
      up--
    }
  }

  // 如果不是绝对路径，又有多余的 .. 没处理完，就要补全
  // ./a/../../b -> ../b
  if (!mustEndAbs) {
    for (; up--; up) {
      fromParts.unshift('..')
    }
  }

  // 如果有一个是绝对路径，而且当前得到的结果没有绝对路径出现，就要补上
  if (
      mustEndAbs &&
      fromParts[0] !== '' &&
      (!fromParts[0] || !isAbsolute(fromParts[0]))
  ) {
    fromParts.unshift('')
  }

  const result = fromParts.join('/')

  return hasTrailingSlash && result.charAt(result.length - 1) !== '/'
    ? result + '/'
    : result
}