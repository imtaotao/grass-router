// https://github.com/ReactTraining/history/blob/master/modules/DOMUtils.js
export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

export function getConfirmation (message: any, callback: (ok: boolean) => never) {
  callback(window.confirm(message))
}

export function supportsHistory () {
  const ua = window.navigator.userAgent

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  )
    return false

  return window.history && 'pushState' in window.history
}

export function supportsPopStateOnHashChange () {
  return window.navigator.userAgent.indexOf('Trident') === -1
}

export function supportsGoWithoutReloadUsingHash () {
  return window.navigator.userAgent.indexOf('Firefox') === -1
}

export function isExtraneousPopstateEvent (event: PopStateEvent) {
  return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1
}
