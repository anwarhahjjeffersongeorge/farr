'use strict'
import test from 'ava'
import { Farr } from '..'
import kindOf from 'kind-of'

const {PI} = Math
const max = 2**32 - 1
const min = -(max + 1)

test('max index is ecmascript array index', t => {
  const shouldGo = () => new Farr(max)
  const mustThro = () => new Farr(max + 1)
  t.notThrows(shouldGo, 'accepts max array index of +2**32 - 1')
  const e = t.throws(mustThro, RangeError)
  t.is(e.message,  'Invalid array length')
})

test('negative indexing', t => {
  const r = 64
  let f = new Farr(r)
  const x = (R) => Math.sin((R + 1)/r/((2*PI) - PI))
  for (let i = 0; i < f.length; i++) {
    f[i] = x(i)
  }
  // t.log(f)
  const i = -37
  t.is(f[i](), x(r+i), 'returns expected element')
  f[i] = i
  t.is(f[i](), i, 'set works, creating function')
})
