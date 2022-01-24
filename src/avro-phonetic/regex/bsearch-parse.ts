import patterns, { MAX_PATTERN_LEN } from './paterns'
import { matchRules } from './match-rules'
import { convertToUnicodeValue, fixString } from './utils'

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
        let left = 0
        let right = patterns.length - 1
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
          } else if (
            find.length > chunk.length ||
            (find.length == chunk.length && find < chunk)
          ) {
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
