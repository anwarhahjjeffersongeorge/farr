'use strict'
import test from 'ava'
import { Farr } from '..'
import kindOf from 'kind-of'

test('import', t => {
  t.not(typeof farr, undefined, 'is something')
  // t.is(typeof farr, 'something', 'is a something type')
})

test('new instance starts empty', t => {
  t.is(new Farr().length, 0, 'message');
})

test('constructor accepts arrays, converting elements to functions', t => {
  const types = [
    '',
    33,
    {},
    [],
    new Int16Array(),
    null
  ]
  const f = new Farr(types)
  // t.log(f)
  for (var i = 0; i < f.length; i++) {
    t.is(kindOf(f[i]), 'function', 'should have been function type')
    t.is(f[i](), types[i], 'function should have returned original value')
  }
})

test('constructor accepts arrays, leaving function elements as is', t => {
  const types = [
    '',
    33,
    {},
    () => 5,
    [],
    new Int16Array(),
    null
  ]
  const f = new Farr(types)
  // t.log(f)
  for (var i = 0; i < f.length; i++) {
    t.is(kindOf(f[i]), 'function', 'should have been function type')
    switch (kindOf(types[i])) {
      case 'function':
        t.is(f[i], types[i], 'function should equal source function')
        break
      default:
        t.is(f[i](), types[i], 'function should have returned original value')
    }
  }
})
