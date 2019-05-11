'use strict'
import test from 'ava'
import { Farr } from '..'
import kindOf from 'kind-of'
const  { bigint } = process.hrtime

const tolerance = .02
const arr = []
// const dms = 100
// const units = 'ms'

const nCycles = 16
const numFs = 16
let fsCascade = Array(numFs)
let fsAll = Array(numFs)
let fsPeriodic = Array(numFs)

test.before(t => {
  fsCascade.fill((a = 0) => {
    return a-1
  })
  fsAll.fill((a = 0) => {
    // console.log(a)
    return a-1
  })
  fsPeriodic.fill(() => {
    arr.push(bigint())
  })
})

test('is a chainable class method', t => {
  const f = new Farr()
  t.is(f.nCycles(), f, 'call returns instance')
})

test(`sets the number of cycles for a subsequent terminal command › cascade`, async t => {
  const f = new Farr()
  f.push(...fsCascade)
  f.nCycles(nCycles)

  // t.log(f.commandJson())
  t.notDeepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command updated after nonterminal command')
  const result = await f.cascade()
  t.deepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command cleared after terminal command')
  // t.log(f.commandJson())

  const expected = -nCycles * numFs
  t.is(result, expected, `must do ${nCycles} cycles of ${numFs} functions`)
})

test(`sets the number of cycles for a subsequent terminal command › all`, async t => {
  const f = new Farr()
  f.push(...fsAll)
  f.nCycles(nCycles)

  // t.log(f.commandJson())
  t.notDeepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command updated after nonterminal command')
  const result = await f.all()
  t.deepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command cleared after terminal command')
  // t.log(f.commandJson())

  const expected = new Array(numFs).fill(-nCycles)
  t.deepEqual(result, expected, `must do ${nCycles} cycles of ${numFs} functions`)
})


test(`sets the number of cycles for a subsequent terminal command › periodic`, async t => {
  const f = new Farr()
  f.push(...fsPeriodic)
  f.nCycles(nCycles)

  // t.log(f.commandJson())
  t.notDeepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command updated after nonterminal command')
  const result = await f.periodic()
  t.deepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command cleared after terminal command')
  // t.log(f.commandJson())

  const expected = nCycles
  t.deepEqual(arr.length, expected, `must do ${nCycles} cycles`)
})
