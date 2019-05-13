'use strict'
import test from 'ava'
import { Farr } from '..'
import kindOf from 'kind-of'
import {is} from './utils'
const  { bigint } = process.hrtime
const tolerance = .15
const arr = []
const delay = 100
const units = 'ms'
const n = 64
const T = n * delay
let fs = Array(n)

test.before(t => {
  fs.fill(n)
  fs = fs.map((v, i) => () => arr.push(bigint()))
})

test('it is a unary asynchronous instance method', t => {
  const f = new Farr().periodic
  t.is(is.asyncFunction(f), true, 'is async function')
  t.is(f.length, 1, 'is unary');
})

test(`calls ${n} functions at ${delay}${units} intervals +/-${tolerance * 100}%`, async t => {
  const f = new Farr()
  f.push(...fs)
  await f.periodic({delay})
  // t.log(arr)
  for (let i = 1; i < arr.length; i++) {
    const dt = Math.round(Number(arr[i] - arr[i - 1]) / 1e6)
    // t.log(dt, delay)
    t.is(Math.abs((dt-delay)/delay) < tolerance, true, `real interval ${dt} roughly equals timestamp delta ${delay}`)
  }
})
