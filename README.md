[![Version](https://img.shields.io/github/package-json/v/anwarhahjjeffersongeorge/farr/master.svg)](https://github.com/anwarhahjjeffersongeorge/farr)[![Build Status](https://travis-ci.com/anwarhahjjeffersongeorge/farr.svg?branch=master)](https://travis-ci.com/anwarhahjjeffersongeorge/farr) [![codecov](https://codecov.io/gh/anwarhahjjeffersongeorge/farr/branch/master/graph/badge.svg)](https://codecov.io/gh/anwarhahjjeffersongeorge/farr)
------------

[![license](https://img.shields.io/github/license/anwarhahjjeffersongeorge/farr.svg)](UNLICENSE) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-blue.svg)](https://standardjs.com)

--------------

# &mdash; `farr` &mdash;
### [Documentation](https://anwarhahjjeffersongeorge.github.io/farr/)

### arrays of functions only

This module exports a single class `Farr`, that extends the native Array class.

Anytime an [array-index](http://ecma-international.org/ecma-262/9.0/index.html#array-index)-valued property of a `Farr` is set, the provided value gets filtered:
- If the value is a `function`, it's left as-is.
- If the value is not a `function`, it's replaced by a new anonymous function that produces the value when called.

This means that`Farr` arrays only store `function` elements or empty slots.

### Methods

`Farr` instances have various methods.

#### Terminal Methods
These are unary, asynchronous and non-chainable:

- .all
- .cascade
- .periodic

#### Nonterminal Methods
These are variadic, synchronous and chainable:

- .at
- .after
- .nCycles

------
## Installation

Run `npm install farr`

## Usage

    import {Farr} from 'farr'

or

    const Farr = require('farr')


## Testing
Run `npm test`

### Dependents
This module is a parent class for another module [farr-this](https://anwarhahjjeffersongeorge.github.io/farr-this/). The farr-this module will auto-run the tests from this module, so changes made here should also work there.

## Documentation

Please see [Docs](https://anwarhahjjeffersongeorge.github.io/farr/).

## Contributing Guidelines
1.  All tests must pass (see Dependents) and all new functionality must include tests.
3. Code must adhere to [JavaScript Standard Style](https://standardjs.com).
4. New code must include [JSDoc documentation](https://jsdoc.app/).
5. Build must pass [TravisCI](https://travis-ci.com/anwarhahjjeffersongeorge/farr).

Thanks.

## License
[Unlicense](https://unlicense.org/)

## Author
[Anwar Hahj Jefferson-George](https://github.com/anwarhahjjeffersongeorge)
