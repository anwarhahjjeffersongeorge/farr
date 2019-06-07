### Chaining calls

Call all of the functions in the array, passing the result of each call to the next, awaiting the resolution of the last call

    (async () => {
      const n = 10
      const fs = []
      for (let i = 0; i < n; i++) {
        fs[i] = (d = '') => d.toString() + i.toString()
      }

      const f =  new Farr(fs)

      const result= await f.cascade() // '0123456789'
    })()


Perform the above, but do so with a start value

    (async () => {
      const n = 10
      const fs = []
      for (let i = 0; i < n; i++) {
        fs[i] = (d = '') => d.toString() + i.toString()
      }

      const f =  new Farr(fs)

      const result= await f.cascade('o') // 'o0123456789'
    })()
