### Scheduling a call to follow a delay
Perform the next terminal call after a specified wait period:

    (async () => {
      const delay = 1600 // milliseconds, number or numeric string
      const numFs = 16
      let fs = Array(numFs).fill((a = 0) => {
        return a-1
      })

      const f =  new Farr(fs)

      f.after(delay)
      const result = await f.cascade() // -16 ... about 1600 ms later

    })()

Perform the above with chaining:

    (async () => {
      const delay = 1600 // milliseconds
      const numFs = 16
      let fs = Array(numFs).fill((a = 0) => {
        return a-1
      })

      const f =  new Farr(fs)

      const result = await f.after(delay).cascade() //  -16 ... about 1600 ms later

    })()


### Accuracy
Calling `.after` erases any previous command set by calling `.after` or `.at`. Timing is not guaranteed to be exact and starts from roughly the moment of the next terminal call.

#### Reference
[setTimeout](https://nodejs.org/api/timers.html#timers_settimeout_callback_delay_args)
