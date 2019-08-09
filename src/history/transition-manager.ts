import { warning } from './utils'
import { Action, Location, ConfirmFunction } from './type'

// 锁的行为可能是一个回调或者是一个 boolean 值
type PromptFunction = (location: Location, action: Action) => string | boolean
export type Prompt = null | boolean | PromptFunction

export default function () {
  let listeners: Array<Function> = []
  let prompt: Prompt = null

  // 用于锁住路由切换
  function setPrompt (nextPrompt: Prompt) : Function {
    warning(prompt == null, 'A history supports only one prompt at a time')

    prompt = nextPrompt

    return () => {
      if (prompt === nextPrompt) prompt = null
    }
  }

  function confirmTransitionTo (
      location: Location,
      action: Action,
      getUserConfirmation: ConfirmFunction,
      callback: (ok: boolean) => never,
  ) {
    // 如果没有锁住
    if (prompt != null) {
      const result = typeof prompt === 'function' ? prompt(location, action) : prompt

      if (typeof result === 'string') {
        typeof getUserConfirmation === 'function'
          ? getUserConfirmation(result, callback)
          : callback(true)
      } else {
        callback(result !== false)
      }
    } else {
      callback(true)
    }   
  }

  // 为每个 fn 利用闭包加一个锁
  function appendListener (fn: Function) : Function {
    let isActive = true

    function listener (...args) {
      isActive && fn(...args)
    }

    listeners.push(listener)

    return () => {
      isActive = false
      listeners = listeners.filter(fn => fn !== listener)
    }
  }

  function notifyListeners (...args) {
    listeners.forEach(listener => listener(...args))
  }

  return {
    setPrompt,
    appendListener,
    notifyListeners,
    confirmTransitionTo,
  }
}