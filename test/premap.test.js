'use strict'
import test from 'ava'
import { Farr } from '..'

test('is a chainable class method', t => {
  const f = new Farr()
  t.is(f.premap(), f, 'call returns instance')
})

test('can be used to parse any value prior to insertion', t => {
  const nums = [1, 4, 8, 64, 256, 1024, 24, 16384]
  const f = new Farr().premap(y => y * y)
  f.push(...nums)
  for (let i = 0; i < f.length; i++) {
    t.is(f[i](), nums[i] * nums[i], 'should have mutated item before insertion')
  }
  f.premap(o => [o]).push(1)
  t.deepEqual(f.tail(), [1], 'premap can be adjusted')
})
