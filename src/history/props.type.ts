type ConfirmFunction = (message: any, callback: Function) => boolean

export interface BrowserProps {
  basename: string
  keyLength: number
  forceRefresh: boolean
  getUserConfirmation: ConfirmFunction
}