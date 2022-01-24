import { Rule, Scope, Type } from './paterns'
import { isConsonant, isExact, isPunctuation, isVowel } from './utils'

export const matchRules = (
  rules: Rule[],
  input: string,
  index: number,
  end: number
) => {
  const prevC = input[index - 1],
    nextC = input[end]
  checkRules: for (const rule of rules) {
    // Validate each matches.
    // Continue to next rule if any validation fails.
    for (const match of rule.matches) {
      const c = match.type === Type.Prefix ? prevC : nextC
      const neg = match.negative
      switch (match.scope) {
        case Scope.Punctuation:
          if ((c === undefined || isPunctuation(c)) === neg) continue checkRules
          break
        case Scope.Vowel:
          if ((c && isVowel(c)) === neg) continue checkRules
          break
        case Scope.Consonant:
          if ((c && isConsonant(c)) === neg) continue checkRules
          break
        case Scope.Exact: {
          const value = match.value
          let s, e
          if (match.type === Type.Prefix) {
            s = index - value.length
            e = index
          } else {
            s = end
            e = end + value.length
          }
          if (isExact(value, input, s, e) === neg)
            continue checkRules
          break
        }
      }
    }
    // Validation complete
    return rule.replace
  }
  return false
}
