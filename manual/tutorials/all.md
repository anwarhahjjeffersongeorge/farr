### "Not-quite Parallel" calls

Call all of the functions in the array, awaiting the resolution of all

    (async () => {
      const n = 10
      const fs = []
      for (let i = 0; i < n; i++) {
        fs[i] = (d = '') => d.toString() + i.toString()
      }

      const f =  new Farr(fs)

      const result= await f.all() // ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]
    })()

Perform the above, but do so with a start value

    (async () => {
      const n = 10
      const fs = []
      for (let i = 0; i < n; i++) {
        fs[i] = (d = '') => d.toString() + i.toString()
      }

      const f =  new Farr(fs)

      const result= await f.all('oooo') // ['oooo0', 'oooo1', 'oooo2','oooo3','oooo4','oooo5' 'oooo6', 'oooo7', 'oooo8', 'oooo9']
    })()

The calls performed in the Farr#all loop are not performed in true parallel. They are synchronous, and the function returns a valueasynchronously. For instance:

    new Farr(new Array(9).fill(process.hrtime.bigint)).all().then(console.log)

    // [
    //   2647620485651672n,
    //   2647620485680829n,
    //   2647620485692420n,
    //   2647620485694427n,
    //   2647620485695742n,
    //   2647620485698066n,
    //   2647620485699393n,
    //   2647620485700595n,
    //   2647620485701760n
    // ]

#### Reference

[Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
