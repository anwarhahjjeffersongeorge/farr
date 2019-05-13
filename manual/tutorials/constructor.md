### Constructor
Create a new instance:

    new Farr()

Create a new instance from an array, transforming the elements into functions

    const types = ['283a', 33, {}, [], new Int16Array(), null]
    const f = new Farr(types)
    f // Farr @Array [ Function {}, Function {}, Function {}, Function {}, Function {}, Function {} ]
    f[0]() // '283a'
