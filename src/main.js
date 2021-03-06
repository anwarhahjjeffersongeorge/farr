'use strict'
import kindOf from 'kind-of'
import dayjs from 'dayjs'
import temporal from 'temporal'
const MAX_ARRAY_INDEX = 2 ** 32 - 1
const MIN_NEGA_INDEX = -(MAX_ARRAY_INDEX + 1)
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
   * @memberof Farr#
   * @name after
   * @param {(String|Number)} [t] the millisecond delay after which the next terminal command should occur...if a non-Number object is provided, it will be cast to Number
   * @return {Farr} this instance (Proxy)
   * @tutorial after
   */
  #after = (t) => {
    if (['string'].includes(kindOf(t))) {
      t = Number(t)
    }
    // console.log(t)
    if (typeof t === 'number') {
      this.#commands.t0 = () => {
        return (t > 0) ? t : Farr.baseCommands.t0
      }
    }

    return this.#P
  }
  #premapper = null
  #generatedS = Symbol('generated')
  #isGenerated = f => typeof f === 'function' && f[this.#generatedS] === true
  #funcWrapper = u => {
    // premap the value if premapper set
    const v = this.#premapper ? this.#premapper(u) : u
    // wrap any non-function values
    return typeof v === 'function' ? v : Object.defineProperty(() => v, this.#generatedS, {
      value: true,
      configurable: false,
      enumerable: false,
      writable: false
    })
  }
  /**
   * premap - set a function that maps any value given to it
   * - chainable
   * @method
   * @memberof Farr#
   * @name premap
   * @param {(function)} [f] the mapping function. called with the value, should return something
   * @return {Farr} this instance (Proxy)
   * @tutorial premap
   */
  #premap = (f) => {
    this.#premapper = (typeof f === 'function') ? f : null
    return this.#P
  }
  /**
   * at - schedule the next terminal command to occur at date/time __t__
   * - chainable
   * @method
   * @memberof Farr#
   * @name at
   * @param {(String|Number|date|dayjs)} [t] the date/time at which the next terminal command should occur...if a non-dayjs object is provided, it will be cast to dayjs
   * @return {Farr} this instance (Proxy)
   * @tutorial at
   */
  #at = (t) => {
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
    return this.#P
  }
  // the current commands for the next terminal function call
  #commands = Object.assign({}, Farr.baseCommands)
  /**
   * get this.#commands as a JSON object]
   *
   * @method
   * @memberof Farr#
   * @name commandJson
   */
  #commandJson = () => {
    const o = Object.assign({}, this.#commands)
    for (let k in o) {
      if (o.hasOwnProperty(k)) {
        o[k] = (typeof o[k] === 'function') ? o[k]() : o[k]
      }
      return JSON.stringify(o)
    }
  }
  // constrain a given array index
  #constrainIndex = i => (Math.sign(i) === -1) ? this.length + Number(i) : i
  /**
   * reset the current this.#commands
   *
   * @method
   * @memberof Farr#
   * @name clearCommands
   */
  #clearCommands = () => {
    Object.assign(this.#commands, Farr.baseCommands)
  }
  /**
   * halt current activities, including
   * 1. temporal tasks, and
   * 2. any timers
   *
   * @method
   * @memberof Farr#
   * @name halt
   */
  #halt = () => {
    temporal.stop()
    this.#timerPool.forEach(timer => clearTimeout(timer))
  }
  // controls to be exposed
  #controls = new Map([
    ['clearCommands', this.#clearCommands.bind(this)],
    ['commandJson', this.#commandJson.bind(this)],
    ['halt', this.#halt.bind(this)]
  ])
  /**
   * nCycles - schedule the next terminal command to occur __n__ times
   * - chainable
   * @method
   * @memberof Farr#
   * @name nCycles
   * @param {Number} [n=1] the number of times the next terminal command should occur...
   * @return {Farr} this instance (Proxy)
   * @tutorial nCycles
   */
  #nCycles = (n) => {
    n = (kindOf(n) === 'number') ? n : 1
    this.#commands.nCycles = n
    return this.#P
  }
  // keys for parsing non terminal (chainable) commands
  #nonterminals = new Map([
    ['after', this.#after],
    ['at', this.#at],
    ['nCycles', this.#nCycles],
    ['premap', this.#premap]
  ])
  // a Proxy to this
  #P = null
  // keys for parsing terminal commands
  #terminals = new Map([
    ['all', this.all],
    ['cascade', this.cascade],
    ['periodic', this.periodic]
  ])
  // the timers created by this instance
  #timerPool = new Set()
  // get a task-wrapped function corresponding to those in this.#terminals
  #wrappedTerminal = (terminal) => {
    const { t0, nCycles } = this.#commands
    const clearCommands = this.#clearCommands
    const dt = (typeof t0 === 'function') ? t0() : null
    const f = terminal.bind(this)
    return async (arg) => {
      clearCommands()
      const cycle = async () => {
        // const C = new Array(nCycles).fill(f.bind(this))
        let s = arg
        for (let i = 0; i < nCycles; i++) {
          if (i === 0) {
            s = (s) ? await f(s) : await f()
          } else {
            s = await f({ s })
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
  #getters = new Map([
    /**
     * get generated - given index n in this instance, get a boolean telling whether corresponding element was generated by this instance
     * @method
     * @memberof Farr#
     * @param {(number)} n index to check
     * @return {(boolean|Array<boolean>)}
     */
    ['generated', (n) => Farr.isSafeIndex(n) ? this.#isGenerated(this[n]) : Array.from(this.map((f) => this.#isGenerated(f)))],
    /**
     * get givenFunc - given index n in this instance, get a boolean telling whether corresponding element was not generated by this instance
     * @method
     * @memberof Farr#
     * @param {(number)} n index to check
     * @return {(boolean|Array<boolean>)}
     */
    ['givenFunc', (n) => {
      const nn = this.generated(n)
      const inv = (a) => !a
      return Array.isArray(nn) ? nn.map(inv) : inv(nn)
    }]
  ])
  #exposeGetters = () => {
    const v = Object.fromEntries([...this.#getters].map((ar) => [ar[0], {
      enumerable: false,
      get: () => ar[1]
    }]))
    return Object.defineProperties(this, v)
  }

  /**
   * constructor - create a Farr instance
   *
   * @param  {(Array|number)} [arr] if an Array, its elements will be used to populate the new instance. if a number, it sets the instance's length -- Array
   * @return {Array} this instance (Proxy)
   * @tutorial constructor
   */
  constructor (arr) {
    super()
    this.#exposeGetters()
    this.#P = new Proxy(this, {
      set (target, prop, value) {
        if (Farr.isSafeIndex(prop)) {
          prop = target.#constrainIndex(prop)
          return Reflect.set(target, prop, target.#funcWrapper(value))
        }
        return Reflect.set(...arguments)
      },
      get (target, prop, receiver) {
        if (Farr.isSafeIndex(prop)) {
          prop = target.#constrainIndex(prop)
        } else if (kindOf(prop) === 'string') {
          if (target.#nonterminals.has(prop)) {
            return (...args) => target.#nonterminals.get(prop)(...args)
          } else if (target.#terminals.has(prop)) {
            const terminal = target.#terminals.get(prop)
            return target.#wrappedTerminal(terminal)
          } else if (target.#controls.has(prop)) {
            return target.#controls.get(prop)
          }
        }
        return Reflect.get(target, prop, receiver)
      }
    })
    if (Array.isArray(arr)) {
      this.#P.push(...arr)
    } else if (Number.isInteger(arr)) {
      this.length = arr
    }
    return this.#P
  }

  /**
   * async all -  A unary asynchronous instance method that
   * - calls functions in order,
   * - resolves when all the functions called return, and
   * - accepts a parameter __arg__ that contains
   *     1. a starting value __arg.s__ to be passed to all functions

   * -
   * @async
   * @param  {object} [arg = {s: undefined}] argument
   * @return {Promise} result of Promise.all call on this' function elements
   * @tutorial all
   */
  async all (arg = { s: undefined }) {
    let { s } = arg
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
   * @tutorial cascade
   */
  async cascade (arg = { s: undefined }) {
    let { s } = arg
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
   * async periodic -  A unary asynchronous instance method that
   * - calls functions in order,
   * - accepts a parameter __arg__ that contains
   *     1. a starting value __arg.s__ to be passed to all functions
   *     2. a millisecond interval value __arg.delay__
   *
   * @async
   * @param  {object} [arg = {delay: 233, s: undefined}] argument
   * @return {Promise} eventual result of call on this' function elements
   * @tutorial periodic
   */
  async periodic (arg = { delay: 233, s: undefined }) {
    const { s, delay } = arg
    const { length } = this
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
    // const queue = await this.temporal.queue(tasks)
    await this.temporal.queue(tasks)
    // console.log(queue)
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(Promise.all(results)), delay * length)
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
  /**
   * the default commands
   * @memberof Farr
   * @name baseCommands
   * @static
   */
  baseCommands: {
    value: Object.freeze({
      t0: 0,
      nCycles: 1
    }),
    enumerable: true,
    writable: false,
    configurable: false
  },
  /**
   * determine whether a number __d__ can be used as an array index
   * @method
   * @name isSafeIndex
   * @param  {Number} d the number to test
   * @return {Boolean}   true if d is a usable array index
   * @memberof Farr
   * @static
   */
  isSafeIndex: {
    value: (d) => {
      return (typeof d !== 'symbol') && Number.isInteger(+d) && MIN_NEGA_INDEX <= d && d <= MAX_ARRAY_INDEX
    },
    enumerable: true,
    writable: false,
    configurable: false
  },
  /**
   * array containing the string keys of the non terminal functions
   *
   * @name nonTerminalKeys
   * @memberof Farr
   * @static
   */
  nonTerminalKeys: {
    value: ['after', 'at', 'nCycles', 'premap'],
    enumerable: true,
    writable: false,
    configurable: false
  }
})

export { Farr }
