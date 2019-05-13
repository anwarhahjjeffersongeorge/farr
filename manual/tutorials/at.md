### Scheduling a call to happen in the future
Perform the next terminal call at a specified date/time:

    (async () => {
      const datetime = dayjs().add(1, 'day') // dayjs instance, but can be dayjs-parseable date string
      const numFs = 16
      let fs = Array(numFs).fill((a = 0) => {
        return a-1
      })

      const f =  new Farr(fs)

      f.after(datetime)
      const result = await f.cascade() // -16... about a day later

    })()

Perform the above with chaining:

    (async () => {
      cconst datetime = dayjs().add(1, 'day') // dayjs instance, but can be dayjs-parseable date string
      const numFs = 16
      let fs = Array(numFs).fill((a = 0) => {
        return a-1
      })

      const f =  new Farr(fs)

      const result = await f.after(datetime).cascade() // -16 ... about a day later
    })()


### Accuracy
Calling `.at` erases any previous command set by calling `.at` or `.after`. Timing is not guaranteed to be exact and starts from roughly the moment of the next terminal call.

#### Reference
[setTimeout](https://nodejs.org/api/timers.html#timers_settimeout_callback_delay_args)
[dayjs](https://www.npmjs.com/package/dayjs)
