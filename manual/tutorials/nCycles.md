### Doing cycles of calls

Repeat the next terminal call a given number of cycles, passing the result of one cycle to the next:

    (async () => {
      const nCycles = 16
      const numFs = 16
      let fs = Array(numFs).fill((a = 0) => {
        return a-1
      })

      const f =  new Farr(fs)
      f.nCycles(nCycles)

      const result = await f.cascade() // -256 === -16 * 16
    })()


Perform the above, but do so with a start value

    (async () => {
      const nCycles = 16
      const numFs = 16
      let fs = Array(numFs).fill((a = 0) => {
        return a-1
      })

      const f =  new Farr(fs)
      f.nCycles(nCycles)

      const result = await f.cascade({s: 1}) // -255 === 1 - (16 * 16)
    })()


#### Reference
[temporal](https://www.npmjs.com/package/temporal)
