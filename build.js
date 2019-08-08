const path = require('path')
const rollup = require('rollup')
const rm = require('rimraf').sync
const babel = require('rollup-plugin-babel')
const cmd = require('rollup-plugin-commonjs')
const cleanup = require('rollup-plugin-cleanup')
const resolve = require('rollup-plugin-node-resolve')
const typescript = require('rollup-plugin-typescript2')
const watch = require('node-watch')

const entryPath = path.resolve(__dirname, 'src/index.ts')
const outputPath = filename => path.resolve(__dirname, './dist', filename)

const esm = {
  input: entryPath,
  output: {
    file: outputPath('grass-router.esm.js'),
    format: 'es',
  }
}

const umd = {
  input: entryPath,
  output: {
    file: outputPath('grass-router.min.js'),
    format: 'umd',
    name: 'GrassRouter',
  }
}

const cjs = {
  input: entryPath,
  output: {
    file: outputPath('grass-router.common.js'),
    format: 'cjs',
  }
}

async function build (cfg, type, sourcemap = false) {
  cfg.output.sourcemap = sourcemap

  const bundle = await rollup.rollup({
    input: cfg.input,
    plugins: [
      cleanup(),
      resolve(),
      babel({
        babelrc: true,
        exclude: 'node_modules/**',
      }),
      typescript({
        tsconfig: 'tsconfig.json',
        typescript: require('typescript'),
        cacheRoot: path.resolve(__dirname, `.cache_${type}`),
      }),
      cmd(),
    ]
  })
  await bundle.generate(cfg.output)
  await bundle.write(cfg.output)
}

console.clear()
// delete old build files
rm('./dist')

const buildVersion = sourcemap => {
  build(esm, 'esm', sourcemap)
  build(cjs, 'cjs', sourcemap)
  build(umd, 'umd', sourcemap)
}

// watch, use in dev and test
if (process.argv.includes('-w')) {
  let i = 0
  watch('./src', { recursive: true }, () => {
    console.clear()
    console.log('Rebuild times: ' + ++i)
    buildVersion(true)
  })
  buildVersion(true)
} else {
  buildVersion()
}
