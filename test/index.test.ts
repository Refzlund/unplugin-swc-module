import { test } from 'uvu'
import assert from 'uvu/assert'
import path from 'path'
import swc from '../src'
import { rollup } from 'rollup'

const fixture = (...args: string[]) => path.join(__dirname, 'fixtures', ...args)

test('rollup', async () => {
  const bundle = await rollup({
    input: fixture('rollup/index.ts'),
    plugins: [
      swc.rollup({
        tsconfigFile: false,
      }),
    ],
  })

  const { output } = await bundle.generate({
    format: 'cjs',
    dir: fixture('rollup/dist'),
  })

  assert.is(
    output[0].code,
    `'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var foo = 'foo';

exports.foo = foo;
`,
  )
})

test('read tsconfig', async () => {
  const bundle = await rollup({
    input: fixture('read-tsconfig/index.tsx'),
    plugins: [swc.rollup()],
  })

  const { output } = await bundle.generate({
    format: 'cjs',
    dir: fixture('read-tsconfig/dist'),
  })

  const code = output[0].code
  assert.match(code, 'customJsxFactory')
})

test('custom swcrc', async () => {
  const bundle = await rollup({
    input: fixture('custom-swcrc/index.tsx'),
    plugins: [
      swc.rollup({
        tsconfigFile: false,
      }),
    ],
  })

  const { output } = await bundle.generate({
    format: 'cjs',
    dir: fixture('custom-swcrc/dist'),
  })

  const code = output[0].code
  assert.match(code, 'customPragma')
})

test.run()