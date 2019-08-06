const fs = require('fs')
const rollup = require('rollup')
const rm = require('rimraf').sync
const babel = require('rollup-plugin-babel')
const cmd = require('rollup-plugin-commonjs')
const cleanup = require('rollup-plugin-cleanup')
const resolve = require('rollup-plugin-node-resolve')
const typescript = require('rollup-plugin-typescript2')

const esm = {
  input: 'src/index.ts',
  output: {
    file: 'dist/grass-router.esm.js',
    format: 'es',
  }
}

const umd = {
  input: 'src/index.ts',
  output: {
    file: 'dist/grass-router.min.js',
    format: 'umd',
    name: 'GrassRouter',
  }
}

const cjs = {
  input: 'src/index.ts',
  output: {
    file: 'dist/grass-router.common.js',
    format: 'cjs',
  }
}

async function build (cfg, sourcemap = false) {
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
      }),
      cmd(),
    ]
  })
  await bundle.generate(cfg.output)
  await bundle.write(cfg.output)
}

// delete old build files
rm('./dist')

const buildVersion = sourcemap => {
  build(esm, sourcemap)
  build(cjs, sourcemap)
  build(umd, sourcemap)
}

// watch, use in dev and test
if (process.argv.includes('-w')) {
  let i = 0
  fs.watch('./src', () => {
    console.clear()
    console.log('Rebuild times: ' + ++i)
    buildVersion(true)
  })
  buildVersion(true)
} else {
  buildVersion()
}
