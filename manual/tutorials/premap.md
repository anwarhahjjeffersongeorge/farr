### Premapping elements before insertion

    const nums = [1, 4, 8, 64, 256, 1024, 24, 16384]
    const f = new Farr().premap(y => y * y)
    f.push(...nums)
    f[1]() // 16
