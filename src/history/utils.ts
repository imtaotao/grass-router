export function warning (condition: any, message: string): void {
  if (condition) return
  if (typeof console !== 'undefined') {
    const text: string = `Warning: ${message}`
    console.warn(text)
  }
}

export function assertParams (path: string | Object, state?: Object) {
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