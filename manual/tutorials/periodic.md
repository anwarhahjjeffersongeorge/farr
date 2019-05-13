### Calling at fixed intervals

Call all of the functions in the array with a specified delay between calls:

    (async () => {
      const n = 9
      const fs = new Array(n).fill(() => Math.floor(Number(process.hrtime.bigint) / 1e6 ))

      const f =  new Farr(fs)

      const result = await f.periodic({delay: 100})

      // [
      //   2648877237
      //   2648877337
      //   2648877437
      //   2648877537
      //   2648877637
      //   2648877737
      //   2648877837
      //   2648877937
      //   2648878037
      // ]
    })()


Perform the above, but do so with a start value:

    (async () => {
      const n = 9
      const fs = new Array(n).fill(() => Math.floor(Number(process.hrtime.bigint) / 1e6 ))

      const f =  new Farr(fs)

      const result = await f.periodic({delay: 100, s:'o'})

      // [
      //   'o2648877237'
      //   'o2648877337'
      //   'o2648877437'
      //   'o2648877537'
      //   'o2648877637'
      //   'o2648877737'
      //   'o2648877837'
      //   'o2648877937'
      //   'o2648878037'
      // ]
    })()

#### Reference
[temporal](https://www.npmjs.com/package/temporal)
