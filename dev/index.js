// 测试 history 这个库的行为
// require.all(['./origin-history/browser'])

const { history } = require('@router')
const h = history.createBrowserHistory()

console.log(h.push())