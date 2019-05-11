'use strict'
import kindOf from 'kind-of'
import dayjs from 'dayjs'
import temporal from 'temporal'
const {bigint} = process.hrtime
/**
 * @classdesc
 * @augments Array
 * arrays of __functions only__
 */
class Farr extends Array {
  /**
   * after - schedule the next terminal command to occur after __t__ milliseconds
   * - chainable
   * @method
   * @param {(String|Number)} [t] the millisecond delay after which the next terminal command should occur...if a non-Number object is provided, it will be cast to Number
   * @return {Farr} this instance (Proxy)
   */
  after = (t) => {
    if (['string'].includes(kindOf(t))) {
      t = Number(t)
    }
    // console.log(t)
    if (typeof t === 'number') {
      this.#commands.t0 = () => {
        return (t > 0) ? t : Farr.baseCommands.t0
      }
    }

    return this.#returnP()
  }
  /**
   * at - schedule the next terminal command to occur at date/time __t__
   * - chainable
   * @method
   * @param {(String|Number|date|dayjs)} [t] the date/time at which the next terminal command should occur...if a non-dayjs object is provided, it will be cast to dayjs
   * @return {Farr} this instance (Proxy)
   */
  at = (t) => {
    if (['string', 'number', 'date'].includes(kindOf(t))) {
      t = dayjs(t)
    }
    if (t instanceof dayjs) {
      this.#commands.t0 = () => {
        const now = dayjs()
        return (t.isAfter(now)) ? t - dayjs() : Farr.baseCommands.t0
      }
    }
    // console.log(this.#commands);
    return this.#returnP()
  }
  // the current commands for the next terminal function call
  #commands = Object.assign({}, Farr.baseCommands)
  // get this.#commands as a JSON object
  commandJson = () => {
    const o = Object.assign({}, this.#commands)
    for (let k in o) {
      if (o.hasOwnProperty(k)) {
        o[k] = (typeof o[k] === 'function') ? o[k]() : o[k]
      }
      return JSON.stringify(o)
    }
  }
  // reset the current this.#commands
  #clearCommands = () => {
    Object.assign(this.#commands, Farr.baseCommands)
  }
  /**
   * halt - halt current activities, including
   * 1. temporal tasks, and
   * 2. any timers
   */
  halt = () => {
    temporal.stop()
    this.#timerPool.forEach(timer => clearTimeout(timer))
  }
  /**
   * nCycles - schedule the next terminal command to occur __n__ times
   * - chainable
   * @method
   * @param {Number} [n=1] the number of times the next terminal command should occur...
   * @return {Farr} this instance (Proxy)
   */
  nCycles = (n) => {
    n = (kindOf(n) === 'number') ? n : 1
    this.#commands.nCycles = n
    return this.#returnP()
  }
  // keys for parsing non terminal (chainable) commands
  #nonterminals = new Map([
    ['after', this.after],
    ['at', this.at],
    ['nCycles', this.nCycles]
  ])
  // get the Proxy to be returned by nonterminal functions
  #returnP = () => this.p
  // keys for parsing  terminal commands
  #terminals = new Map([
    ['all', this.all],
    ['cascade', this.cascade],
    ['periodic', this.periodic]
  ])
  // the timers created by this instance
  #timerPool = new Set()
  // get a task-wrapped function corresponding to those in this.#terminals
  #wrappedTerminal = (prop) => {
    const {t0, nCycles} = this.#commands
    const clearCommands = this.#clearCommands
    const dt = (typeof t0 === 'function') ? t0() : null
    const f = this.#terminals.get(prop).bind(this)
    return async (arg) => {
      clearCommands()
      const cycle = async () => {
        // const C = new Array(nCycles).fill(f.bind(this))
        let s = arg
        for (let i = 0; i < nCycles; i++){
          if (i===0) {
            s = (s) ? await f(s) : await f()
          } else {
            s = await f({s})
          }
        }
        return s
      }
      return (dt) ? new Promise((resolve) => {
        const timeout = setTimeout(() => {
          // console.log(`@t${bigint()}, timeout`)
          resolve(cycle(timeout))
          clearTimeout(timeout)
          this.#timerPool.delete(timeout)
        }, dt)
        this.#timerPool.add(timeout)
        // console.log(`@t${bigint()}, timeout`)
      }) : Promise.resolve(cycle())
    }
  }

  /**
   * constructor - create a Farr instance
   *
   * @param  {Array} [arr] if an Array, its elements will be used to populate the new instance
   * @return {Array} this instance (Proxy)
   * @tutorial constructor
   */
  constructor (arr) {
    super()
    this.p = new Proxy(this, {
      set (target, prop, value) {
        if (Farr.isSafeIndex(prop)) {
          switch (kindOf(value)) {
            case 'function':
              return Reflect.set(target, prop, value)
              break;
            default:
              return Reflect.set(target, prop, () => value)
          }
        }
        return Reflect.set(...arguments)
      },
      get (target, prop, receiver) {
        if (kindOf(prop) !== 'symbol' && Farr.isSafeIndex(prop)) {
          prop = (Math.sign(prop) === -1) ? target.length + Number(prop) : prop
        } else if (kindOf(prop) === 'string' ) {
          if (target.#nonterminals.has(prop)) {
            return (...args) => target.#nonterminals.get(prop)(...args)
          } else if (target.#terminals.has(prop)) {
            return target.#wrappedTerminal(prop)
          }
        }
        return Reflect.get(target, prop, receiver)
      }
    })
    if (Array.isArray(arr)) {
      this.p.push(...arr)
    }
    return this.#returnP()
  }

  /**
   * async all -  A unary asynchronous instance method that
   * - calls functions in order,
   * - resolves when all the functions called return, and
   * - accepts a parameter __arg__ that contains
   *     1. a starting value __arg.s__ to be passed to all functions
   *
   * [Promise.all]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all}
   * -
   * @async
   * @param  {object} [arg = {s: undefined}] argument
   * @return {Promise} result of Promise.all call on this' function elements
   * @tutorial all
   */
  async all (arg = {s: undefined}) {
    let {s} = arg
    const getS = (i) => (Array.isArray(s) && s.length >= this.length) ? s[i] : s
    return Promise.all(this.map((f, i) => f(getS(i))))
  }

  /**
   * async cascade -  A unary asynchronous instance method that
   * - calls functions in order,
   * - accepts a parameter __arg__ that contains
   *     1. a starting value __arg.s__ to be passed to the first function
   * - mutates the given start value
   * @async
   * @param  {object} [arg = {s: undefined}] argument
   * @return {Promise} result of Promise.all call on this' function elements
   */
  async cascade (arg = {s: undefined}) {
    let {s} = arg
    for await (let f of this) {
      s = await f(s)
    }
    return s
  }

  /**
   * get head - get the first element
   *
   * @return {function}  the 0th element
   */
  get head () {
    return this[0]
  }

  /**
   * @static isSafeIndex - determine whether a number __d__ can be used as an array index
   *
   * @param  {Number} d the number to test
   * @return {Boolean}   true if d is a usable array index
   */
  static isSafeIndex (d) {
    return Number.isSafeInteger(+d)
  }

  /**
   * async periodic -  A unary asynchronous instance method that
   * - calls functions in order,
   * - accepts a parameter __arg__ that contains
   *     1. a starting value __arg.s__ to be passed to all functions
   *     2. a millisecond interval value __arg.delay__
   *
   * @async
   * @param  {object} [arg = {delay: 233, s: undefined}] argument
   * @return {Promise} eventual result of call on this' function elements
   */
  async periodic (arg = {delay: 233, s: undefined}) {
    const {s, delay} = arg
    const {length} = this
    const results = new Array(length)
    const tasks = new Array(length)

    for (let i = 0; i < length; i++) {
      const f = this[i]
      tasks[i] = {
        delay,
        task: () => {
          results[i] = Promise.resolve(f(s))
            .catch(err => err)
        }
      }
    }
    // console.log(tasks)
    const queue = await this.temporal.queue(tasks)
    // console.log(queue)
    return new Promise((resolve, reject)=>{
      setTimeout( () => resolve(Promise.all(results)), delay * length)
    })
  }

  /**
   * get tail - get the last element
   *
   * @return {function}  the last element
   */
  get tail () {
    return this[-1]
  }


  /**
   * get temporal - get the temporal instance used by this instance
   *
   * @return {object} the temporal instance
   */
  get temporal () {
    return temporal
  }

}

Object.defineProperties(Farr, {
  baseCommands: {
    value: Object.freeze({
      t0: 0,
      nCycles: 1
    }),
    enumerable: true,
    writable: false,
    configurable: false
  }
})

export {Farr}
