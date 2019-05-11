### Call all of the functions in the array, awaiting the resolution of all

    const n = 10
    const fs = []
    for (let i = 0; i < n; i++) {
      fs[i] = (d = '') => d.toString() + i.toString()
    }

    const f =  new Farr(fs)

    const result= await f.all() // ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

### Perform the above, but do so with a start value

    const n = 10
    const fs = []
    for (let i = 0; i < n; i++) {
      fs[i] = (d = '') => d.toString() + i.toString()
    }

    const f =  new Farr(fs)

    const result= await f.all() // ['oooo0', 'oooo1', 'oooo2','oooo3','oooo4','oooo5' 'oooo6', 'oooo7', 'oooo8', 'oooo9']

#### Reference

[Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
