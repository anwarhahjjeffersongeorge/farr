'use strict'
import test from 'ava'
import { Farr } from '..'
import kindOf from 'kind-of'
import {is} from './utils'

test('it is a unary asynchronous instance method', t => {
  const f = new Farr().cascade
  t.is(is.asyncFunction(f), true, 'is async function')
  t.is(f.length, 1, 'is unary');
})

for (let giveStartValue of [0, 1]) {
  const s = 333 * Math.random().toFixed(3)
  const startValueLabel = (giveStartValue) ? 'while mutating start value › ' : ''
  const getExpected = e => (giveStartValue) ? s + e : e

  test(`${startValueLabel} calls functions in order`, async t => {
    const n = 10
    const fs = []
    for (let i = 0; i < n; i++) {
      fs[i] = (d = '') => d.toString() + i.toString()
    }
    const expected = '0123456789'
    const f =  new Farr(fs)
    const result = await ((giveStartValue) ?  f.cascade({s}) :  f.cascade())
    t.is(result, getExpected(expected), `${startValueLabel} should do calls in order, passing mutated value`)
  })

  test(`${startValueLabel} calls async functions in order`, async t => {
    const n = 10
    const fs = []
    for (let i = 0; i < n; i++) {
      fs[i] = (d = '') => new Promise((resolve, reject) => {
        setTimeout(() => resolve(d.toString() + i.toString()), 111 / (i + 1))
      })
    }
    const expected = '0123456789'
    const f =  new Farr(fs)
    const result = await ((giveStartValue) ?  f.cascade({s}) :  f.cascade())
    t.is(result, getExpected(expected), `${startValueLabel} should do calls in order, passing mutated value`);
  })
}
