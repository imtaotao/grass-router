import { warning, assertParams } from './utils'
import { BrowserProps } from './props.type'

type Action = 'POP' | 'PUSH' | 'REPLACE'

export interface History {
  readonly length: number
  readonly action: Action
  push: Function
  block: Function
  goBack: Function
  listen: Function
  replace: Function
  goForward: Function
  createHref: Function
  go: (n: number) => void
}

export default function createBrowserHistory (props: BrowserProps) : History {
  const globalHistory = window.history

  function createHref () {}

  function push (path: string | Object, state?: Object) {
    // 对参数进行断言，给出相应的警告
    assertParams(path, state)

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
    length: globalHistory.length,
  }

  return history
}