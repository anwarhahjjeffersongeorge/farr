'use strict'
import test from 'ava'
import { Farr } from '..'

test('wrap status', t => {
  const arr = [
    0, () => 1, 2, () => 3, 4
  ]
  const f = new Farr(arr)
  t.deepEqual(f.generated(), arr.map((v) => typeof v !== 'function'), 'must indicate which functions were generated')
  t.deepEqual(f.givenFunc(), arr.map((v) => typeof v === 'function'), 'must indicate which functions were not generated')
  for (let i = 0; i < f.length; i++) {
    t.is(f.generated(i), typeof arr[i] !== 'function', 'must indicate which functions were generated')
    t.is(f.givenFunc(i), typeof arr[i] === 'function', 'must indicate which functions were not generated')
  }
})
