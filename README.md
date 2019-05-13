Version](https://img.shields.io/github/package-json/v/anwarhahjjeffersongeorge/farr/master.svg) [![Build Status](https://travis-ci.com/anwarhahjjeffersongeorge/farr.svg?branch=master)](https://travis-ci.com/anwarhahjjeffersongeorge/farr) [![codecov](https://codecov.io/gh/anwarhahjjeffersongeorge/farr/branch/master/graph/badge.svg)](https://codecov.io/gh/anwarhahjjeffersongeorge/farr)[![Source Documentation](https://anwarhahjjeffersongeorge.github.io/farr/badge.svg)](https://anwarhahjjeffersongeorge.github.io/farr/source.html)

------------

[![license](https://img.shields.io/github/license/anwarhahjjeffersongeorge/farr.svg)](UNLICENSE) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-blue.svg)](https://standardjs.com)

--------------

# `farr` &mdash; arrays of functions only

This module exports a single class `Farr`, that extends the native Array class.

Anytime an integer-valued property of a `Farr` is set, the provided value gets filtered:
- If the value is a `function`, it's left as-is.
- If the value is not a `function`, it's replaced by a new anonymous function that produces the value when called.

Thus, Farr arrays only store `function` elements.

### Methods

`Farr` instances have various methods.

#### Terminal Methods
These are unary, asynchronous and non-chainable:

- {@tutorial all}
- {@tutorial cascade}
- {@tutorial periodic}

#### Nonterminal Methods
These are variadic, synchronous and chainable:

- {@tutorial at}
- {@tutorial after}
- {@tutorial nCycles}

------
## Installation

Run `npm install farr`

## Usage

    import {Farr} from 'farr'

or

    const Farr = require('farr')


## Testing
Run `npm test`


## Documentation

Please see [Docs](https://anwarhahjjeffersongeorge.github.io/linkedfunclist/).

## Contributing Guidelines
1.  All tests must pass.
3. Code must adhere to [JavaScript Standard Style](https://standardjs.com).
4. New code must include [JSDoc documentation](https://jsdoc.app/).
5. Build must pass [TravisCI](https://travis-ci.com/anwarhahjjeffersongeorge/farr).

Thanks.

## License
[Unlicense](https://unlicense.org/)

## Author
[Anwar Hahj Jefferson-George](https://github.com/anwarhahjjeffersongeorge)
