import patterns, { MAX_PATTERN_LEN } from './patterns'
import { matchRules } from './match-rules'
import { convertToUnicodeValue, fixString } from './utils'

type Range = {
  start: number
  end: number
}

const ranges: Record<number, Range> = Object.create(null)

{
  const range: Range = Object.create(null)
  range.start = range.end = 0
  while (patterns[range.end].find.length === MAX_PATTERN_LEN) range.end += 1
  let previousRange = (ranges[MAX_PATTERN_LEN] = range)
  for (let i = MAX_PATTERN_LEN - 1; i > 0; --i) {
    const range: Range = Object.create(null)
    range.start = range.end = previousRange.end + 1
    while (patterns[range.end]?.find.length === i) range.end += 1
    previousRange = ranges[i] = range
  }
}

// console.log(ranges)

export const parse = (input: string) => {
  const fixed = fixString(input)
  const len = fixed.length

  let output = ''
  let cur = 0
  parse: while (cur < len) {
    for (let chunk_len = MAX_PATTERN_LEN; chunk_len > 0; --chunk_len) {
      const end = cur + chunk_len
      if (end <= len) {
        const chunk = fixed.substring(cur, end)
        // Binary Search
        let { start: left, end: right } = ranges[chunk_len]
        let mid = 0
        while (right >= left) {
          mid = (right + left) >> 1
          const pattern = patterns[mid]
          const find = pattern.find
          if (find === chunk) {
            let replace = pattern.replace
            if (pattern.rules) {
              const res = matchRules(pattern.rules, fixed, cur, end)
              if (res !== false) replace = res
            }
            output += replace + '(্[যবম])?(্?)([ঃঁ]?)'
            cur = end
            continue parse
          } else if (find < chunk) {
            left = mid + 1
          } else {
            right = mid - 1
          }
        }
      }
    }
    output += fixed.charAt(cur)
    cur += 1
  }

  return convertToUnicodeValue(output)
}
