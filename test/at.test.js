'use strict'
import test from 'ava'
import { Farr } from '..'
import kindOf from 'kind-of'
import dayjs from 'dayjs'
const  { bigint } = process.hrtime

const arr = []
// const dms = 100
const units = 'ms'
const tolerance = 20
const periodicTolerance = 300
const dms = 3 * 1000
const nCycles = 16
const numFs = 16
let fsCascade = Array(numFs)
let fsAll = Array(numFs)
let fsPeriodic = Array(numFs)

test.before(t => {
  fsCascade.fill((a = []) => {
    a.push(dayjs())
    return a
  })
  fsAll.fill(() => {
    return dayjs()
  })
  fsPeriodic.fill(() => {
    return dayjs()
  })
})

test('is a chainable class method', t => {
  const f = new Farr()
  t.is(f.at(), f, 'call returns instance')
})

test(`delays subsequent terminal command on time +/-${tolerance}${units} › cascade`, async t => {
  const f = new Farr()
  f.push(...fsCascade)
  const at = dayjs().add(dms, 'millisecond')
  f.at(at)

  // t.log(f.commandJson())
  t.notDeepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command updated after nonterminal command')
  const result = await f.cascade()
  t.deepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command cleared after terminal command')
  // t.log(f.commandJson())


  const condition = k => at - tolerance <= k && k <= at + tolerance
  t.is(condition(result[0]), true, `should call first function at ${at} ...  t0+${dms}${units} +/-${tolerance}${units}`)
})

test(`delays subsequent terminal command on time +/-${tolerance}${units} › all`, async t => {
  const f = new Farr()
  f.push(...fsAll)
  const at = dayjs().add(dms, 'millisecond')
  f.at(at)

  // t.log(f.commandJson())
  t.notDeepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command updated after nonterminal command')
  const result = await f.all()
  t.deepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command cleared after terminal command')
  // t.log(f.commandJson())
  //
  const condition = k => at - tolerance <= k && k <= at + tolerance
  t.is(condition(result[0]), true, `should call first function at ${at} ...  t0+${dms}${units} +/-${tolerance}${units}`)
})

test(`delays subsequent terminal command on time +/-${periodicTolerance}${units}  › periodic`, async t => {
  const f = new Farr()
  f.push(...fsPeriodic)
  const at = dayjs().add(dms, 'millisecond')
  f.at(at)

  // t.log(f.commandJson())
  t.notDeepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command updated after nonterminal command')
  const result = await f.periodic()
  t.deepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command cleared after terminal command')
  // t.log(f.commandJson())
  //
  const condition = k => at - periodicTolerance <= k && k <= at + periodicTolerance
  // t.log(result[0], at)
  t.is(condition(result[0]), true, `should call first function at ${at} ...  t0+${dms}${units} +/-${periodicTolerance}${units}`)
})
