import * as _ from './utils'
import { Action, Location, BrowserProps, HistoryState } from './type'

export interface History {
  readonly length: number
  readonly action: Action
  location: Location
  push: (path: string | any, state?: Object) => void
  block: Function
  goBack: Function
  listen: Function
  replace: Function
  goForward: Function
  createHref: Function
  go: (n: number) => void
}

// IE 11 下直接获取 state 有时会报错
const getHistoryState = () => {
  try {
    return window.history.state || {}
  } catch (err) {
    return {}
  }
}

export function createBrowserHistory (props: BrowserProps = {}) : History {
  if (!_.canUseDOM)
    throw new Error('Browser history needs a DOM')

  const globalHistory = window.history
  const canUseHistory = _.supportsHistory()
  const initialLocation = getDOMLocation(getHistoryState())
  const needsHashChangeListener = !_.supportsPopStateOnHashChange()
  let allKeys = [initialLocation.key]

  const basename = props.basename
    ? _.stripTrailingSlash(_.addLeadingSlash(props.basename))
    : ''

  const {
      keyLength = 6,
      forceRefresh = false,
      getUserConfirmation = _.getConfirmation
  } = props


  function createHref (location: Location) {
    return basename + _.createPath(location)
  }

  function getDOMLocation (historyState: HistoryState = {}) {
    const { key, state } = historyState
    const { pathname, search, hash } = window.location
    let path = pathname + search + hash

    _.warning(
      !basename || _.hasBasename(path, basename),
      '你不应该包含 basename 前缀的 url'
    )

    // 获取去掉 basename 的 path
    if (basename)
      path = _.stripBasename(path, basename)

    return _.createLocation(path, state, key)
  }

  function push (path: string | any, state?: Object) {
    // 对参数进行断言，给出相应的警告
    _.assertParams(path, state)
    const action = 'PUSH'
    const location = _.createLocation(path, state, _.createKey(keyLength), history.location)

  }

  function replace () {}

  function go (n) {}

  function goBack () {}

  function goForward () {}

  function block () {}

  function listen () {}

  const history: History = {
    go,
    push,
    block,
    listen,
    goBack,
    replace,
    goForward,
    createHref,
    action: 'POP',
    location: initialLocation,
    length: globalHistory.length,
  }

  return history
}