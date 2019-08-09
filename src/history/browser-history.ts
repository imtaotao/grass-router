import * as _ from './utils'
import createTransitionManager from './transition-manager'
import {
  Action,
  Location,
  BrowserProps,
  HistoryState,
  BrowserHistory,
} from './type'

// IE 11 下直接获取 state 有时会报错
const getHistoryState = () => {
  try {
    return window.history.state || {}
  } catch (err) {
    return {}
  }
}

export function createBrowserHistory (props: BrowserProps = {}) : BrowserHistory {
  if (!_.canUseDOM)
    throw new Error('Browser history needs a DOM')

  const globalHistory = window.history
  const canUseHistory = _.supportsHistory()
  const transitionManager = createTransitionManager()
  const initialLocation = getDOMLocation(getHistoryState())
  const needsHashChangeListener = !_.supportsPopStateOnHashChange()
  // 记录有所 location 的 key
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

  // 更新本地的 history 对象
  function setState (
    nextState: {
      action: Action
      location: Location
    }
  ) {
    Object.assign(history, nextState)
    history.length = globalHistory.length
    transitionManager.notifyListeners(history.location, history.action)
  }

  function getDOMLocation (historyState: HistoryState = {}) {
    const { key, state } = historyState
    const { pathname, search, hash } = window.location
    let path = pathname + search + hash

    // 如果发现 path 开头不是 basename 需要给一个警告
    _.warning(
      !basename || _.hasBasename(path, basename),
      'You are attempting to use a basename on a page whose URL path does not begin ' +
      'with the basename. Expected path "' +
      path +
      '" to begin with "' +
      basename +
      '".'
    )

    // 获取去掉 basename 的 path
    if (basename)
      path = _.stripBasename(path, basename)

    return _.createLocation(path, state, key)
  }

  function push (path: string | any, state?: any) {
    // 对参数进行断言，给出相应的警告
    _.assertParams(path, state)

    const action = 'PUSH'
    const location = _.createLocation(path, state, _.createKey(keyLength), history.location)

    // 路由变换
    // 需要让用户确定是否进行切换，调用 userconfirmation 回调
    // 如果发生用户返回的 false，需要阻止路由切换
    transitionManager.confirmTransitionTo(
      location,
      action,
      getUserConfirmation,
      ok => {
        if (!ok) return

        const href = createHref(location)
        const { key, state } = location

        if (canUseHistory) {
          globalHistory.pushState({ key, state }, '', href)

          // 如果需要强制更新
          if (forceRefresh) {
            window.location.href = href
          } else {
            const prevIndex = allKeys.indexOf(history.location.key)
            const nextKeys = allKeys.slice(0, prevIndex === -1 ? 0 : prevIndex + 1)

            // 记录当前的 location 的 key
            nextKeys.push(location.key)
            allKeys = nextKeys

            // 更新 history 的状态
            setState({ action, location })
          }
        } else {
          _.warning(
            state === undefined,
            'Browser history cannot push state in browsers that do not support HTML5 history',
          )
          window.location.href = href
        }
      }
    )
  }

  function replace (path: string | any, state?: any) {
    _.assertParams(path, state)
    const action = 'REPLACE'
    const location = _.createLocation(path, state, _.createKey(keyLength), history.location)

    transitionManager.confirmTransitionTo(
      location,
      action,
      getUserConfirmation,
      ok => {
        if (!ok) return
        const href = createHref(location)
        const { key, state } = location

        if (canUseHistory) {
          globalHistory.replaceState({ key, state }, '', href)
  
          if (forceRefresh) {
            window.location.replace(href)
          } else {
            // 直接修改为当前的 key
            const prevIndex = allKeys.indexOf(history.location.key)
            if (prevIndex !== -1) allKeys[prevIndex] = location.key

            setState({ action, location })
          }
        } else {
          _.warning(
            state === undefined,
            'Browser history cannot push state in browsers that do not support HTML5 history',
          )
          window.location.replace(href)
        }
      }
    )
  }

  let listenerCount = 0

  function checkDOMListeners (delta: number) {

  }

  function block () {
    return () => {
    }
  }

  function listen () {
    return () => {
    }
  }

  const history: BrowserHistory = {
    push,
    block,
    listen,
    replace,
    createHref,
    action: 'POP',
    location: initialLocation,
    length: globalHistory.length,
    goBack: () => globalHistory.go(-1),
    goForward: () => globalHistory.go(1),
    go: (n: number) => globalHistory.go(n),
  }

  return history
}