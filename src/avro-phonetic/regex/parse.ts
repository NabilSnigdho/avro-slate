/* eslint-disable @typescript-eslint/no-non-null-assertion */

import patterns, { Pattern } from './paterns'
import { matchRules } from './match-rules'
import { convertToUnicodeValue, fixString } from './utils'

const re = new RegExp(patterns.map((x) => x.find).join('|'), 'g')
const map = Object.create(null)
for (const pattern of patterns) map[pattern.find] = pattern

export const parse = (input: string) => {
  const fixed = fixString(input)
  let output = ''
  let end = 0
  for (const { 0: find, index } of fixed.matchAll(re)) {
    output += fixed.substring(end, index)
    end = index! + find.length

    const pattern = map[find] as Pattern
    let replace = pattern.replace
    if (pattern.rules) {
      const res = matchRules(pattern.rules, fixed, index!, end)
      if (res !== false) replace = res
    }
    output += replace + '(্[যবম])?(্?)([ঃঁ]?)'
  }
  output += fixed.substring(end, fixed.length)
  return convertToUnicodeValue(output)
}
