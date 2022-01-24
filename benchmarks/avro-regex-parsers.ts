import { add, complete, cycle, suite } from 'benny'

import { parse as a } from '../src/avro-phonetic/regex/parse'
import { parse as b } from '../src/avro-phonetic/regex/bsearch-parse'

const longWords = [
  'okkhorbrritto',
  'kyalifOrrniYa',
  'oZaDvarrTaijmenT',
  'noyon`snigdhokor',
  'opoman`jonokvabe',
  'protyut``ponnomoti',
  'uponyas`rocoyita',
]

suite(
  'Avro Regex Parsers: with long words',

  add('Regex Search + HashMap', () => {
    for (const word of longWords) {
      a(word)
    }
  }),

  add('Binary Search', () => {
    for (const word of longWords) {
      b(word)
    }
  }),

  cycle(),
  complete()
)


const shortWords = [
  'OI',
  'til',
  'sei',
  'kak',
  'ken',
  'ami',
  'rel',
]

suite(
  'Avro Regex Parsers: with short words',

  add('Regex Search + HashMap', () => {
    for (const word of shortWords) {
      a(word)
    }
  }),

  add('Binary Search', () => {
    for (const word of shortWords) {
      b(word)
    }
  }),

  cycle(),
  complete()
)
