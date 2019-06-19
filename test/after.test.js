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
const dms = 13 * 1000
const nCycles = 16
const numFs = 16
let fsCascade = Array(numFs)
let fsAll = Array(numFs)
let fsPeriodic = Array(numFs)

test.before(t => {
  fsCascade.fill((a=[]) => {
    a.push(bigint())
    return a
  })
  fsAll.fill(() => {
    return bigint()
  })
  fsPeriodic.fill(() => {
    return bigint()
  })
})

// test('is a chainable class method', t => {
//   const f = new Farr()
//   t.is(f.after(), f, 'call returns instance')
// })

test(`delays subsequent terminal command on time +/-${tolerance}${units} › cascade`, async t => {
  const f = new Farr()
  f.push(...fsCascade)
  const after = dms
  f.after(after)

  // t.log(f.commandJson())
  t.notDeepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command updated after nonterminal command')
  const now = bigint()
  const result = await f.cascade()
  t.deepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command cleared after terminal command')
  // t.log(f.commandJson())

  const condition = k => after - tolerance <= k && k <= after + tolerance
  t.is(condition(Number(result[0]-now)/1e6), true, `should call first function after   t0+${dms}${units} +/-${tolerance}${units}`)
})

test(`delays chained terminal command on time +/-${tolerance}${units} › cascade`, async t => {
  const f = new Farr()
  f.push(...fsCascade)
  const after = dms

  // t.log(f.commandJson())
  const now = bigint()
  const result = await f.after(after).cascade()
  t.deepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command cleared after terminal command')
  // t.log(f.commandJson())


  const condition = k => after - tolerance <= k && k <= after + tolerance
  t.is(condition(Number(result[0]-now)/1e6), true, `should call first function after   t0+${dms}${units} +/-${tolerance}${units}`)
})

test(`delays subsequent terminal command on time +/-${tolerance}${units} › all`, async t => {
  const f = new Farr()
  f.push(...fsAll)
  const after = dms
  f.after(after)

  // t.log(f.commandJson())
  t.notDeepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command updated after nonterminal command')
  const now = bigint()
  const result = await f.all()
  t.deepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command cleared after terminal command')
  // t.log(f.commandJson())
  //
  const condition = k => after - tolerance <= k && k <= after + tolerance
  // t.log('result[0], after, now', result[0], after, now)
  t.is(condition(Number(result[0]-now)/1e6), true, `should call first function after t0+${dms}${units} +/-${tolerance}${units}`)
})

test(`delays chained terminal command on time +/-${tolerance}${units} › all`, async t => {
  const f = new Farr()
  f.push(...fsAll)
  const after = dms

  // t.log(f.commandJson())
  const now = bigint()
  const result = await f.after(after).all()
  t.deepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command cleared after terminal command')
  // t.log(f.commandJson())
  //
  const condition = k => after - tolerance <= k && k <= after + tolerance
  // t.log('result[0], after, now', result[0], after, now)
  t.is(condition(Number(result[0]-now)/1e6), true, `should call first function after t0+${dms}${units} +/-${tolerance}${units}`)
})

test(`delays subsequent terminal command on time +/-${periodicTolerance}${units}  › periodic`, async t => {
  const f = new Farr()
  f.push(...fsPeriodic)
  const after = dms
  f.after(after)

  // t.log(f.commandJson())
  t.notDeepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command updated after nonterminal command')
  const now = bigint()
  const result = await f.periodic()
  t.deepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command cleared after terminal command')
  // t.log(f.commandJson())
  //
  const condition = k => after - periodicTolerance <= k && k <= after + periodicTolerance
  // t.log(result[0], after, now)
  t.is(condition(Number(result[0]-now)/1e6), true, `should call first function after t0+${dms}${units} +/-${periodicTolerance}${units}`)
})

test(`delays chained terminal command on time +/-${periodicTolerance}${units}  › periodic`, async t => {
  const f = new Farr()
  f.push(...fsPeriodic)
  const after = dms


  // t.log(f.commandJson())
  const now = bigint()
  const result = await f.after(after).periodic()
  t.deepEqual(f.commandJson(), JSON.stringify(Farr.baseCommands), 'command cleared after terminal command')
  // t.log(f.commandJson())
  //
  const condition = k => after - periodicTolerance <= k && k <= after + periodicTolerance
  // t.log(result[0], after, now)
  t.is(condition(Number(result[0]-now)/1e6), true, `should call first function after t0+${dms}${units} +/-${periodicTolerance}${units}`)
})
