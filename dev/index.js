// 测试 history 这个库的行为
// require.all(['./origin-history/browser'])

const { history } = require('@router')
const resolvePathname = history.resolvePathname

const res = resolvePathname( '/one', 'http://example.com/one')

console.log(res)