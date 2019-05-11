'use strict'
import test from 'ava'
import { Farr } from '..'
import kindOf from 'kind-of'

const n = 256
let fs = Array(n)

test.before(t => {
  fs.fill(n)
  fs = fs.map((v, i) => i * n)
})

test('.tail is always the tail', t => {
  const f = new Farr()
  for (let fss of fs) {
    f.push(fss)
    t.is(f.tail(), fss, '.tail is tail')
    f.unshift(fss * 2)
    t.is(f.tail(), fss, '.tail is tail')
  }
})

test('.head is always the head', t => {
  const f = new Farr()
  for (let fss of fs) {
    f.unshift(fss * 2)
    t.is(f.head(), fss * 2, '.head is head')
    f.push(fss)
    t.is(f.head(), fss * 2, '.head is head')
  }
})
