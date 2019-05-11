# `farr`
## arrays of functions only

This module exports a single class `Farr`that extends the native Array class.

Anytime an integer-valued property of a `Farr` is set, the provided value gets filtered:
- If the value is a `function`, it's left as-is.
- If the value is not a `function`, it's replaced by a new anonymous function that produces the value when called.

Thus, Farr arrays only store `function` elements.

------
## Installation

Run `npm install farr`

## Usage

    import {Farr} from 'farr'

or

    const Farr = require('farr')


## Testing
Run `npm test`
