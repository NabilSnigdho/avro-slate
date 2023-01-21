/*
    =============================================================================
    *****************************************************************************
    The contents of this file are subject to the Mozilla Public License
    Version 1.1 (the "License"); you may not use this file except in
    compliance with the License. You may obtain a copy of the License at
    http://www.mozilla.org/MPL/

    Software distributed under the License is distributed on an "AS IS"
    basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
    License for the specific language governing rights and limitations
    under the License.

    The Original Code is jsAvroPhonetic

    The Initial Developer of the Original Code is
    Mehdi Hasan Khan <mhasan@omicronlab.com>

    Copyright (C) OmicronLab (http://www.omicronlab.com). All Rights Reserved.


    Contributor(s): _____________________________________.

    *****************************************************************************
    =============================================================================
*/

import { parse as regexParse } from './regex/parse'
import { Parser } from 'okkhor'
import { distance } from 'fastest-levenshtein'
import { data, tableListMap } from './data'

export default class SuggestionBuilder {
  private readonly phonetic
  private dictionaryCache: Record<string, string[]>
  private tempSuffixCache: Record<string, BaseWord>

  constructor() {
    this.phonetic = new Parser()
    this.dictionaryCache = Object.create(null)
    this.tempSuffixCache = Object.create(null)
  }

  private getAutocorrect(input: string, splitWord: SplitWord): string | null {
    //Search for whole match
    const corrected = data.autocorrect[input]
    if (corrected) {
      return this.phonetic.convert(corrected)
    } else {
      //Whole word is not present, search without padding
      const corrected = data.autocorrect[correctCase(splitWord.middle)]
      if (corrected) {
        return (
          splitWord.begin + this.phonetic.convert(corrected) + splitWord.end
        )
      }
    }
    return null
  }

  private addToTempSuffixCache(full: string, base: string, eng: string) {
    //Don't overwrite
    if (!(full in this.tempSuffixCache)) {
      this.tempSuffixCache[full] = { base, eng }
    }
  }

  /**
   * Add suffix(গুলো, মালা, etc.) to the dictionary suggestions and return them.
   *
   * Temporarily stores suffixed and base word pairs to use when updating candidate selections.
   * If a suffixed word gets selected its base also gets stored as a user selected candidate,
   * unless the base has already a user selected candidate.
   */
  private addSuffix(word: string) {
    // Fill up the list with what we have from the cache.
    const list = this.dictionaryCache[word]?.slice(0) ?? []
    this.tempSuffixCache = Object.create(null)

    const len = word.length
    if (len >= 2) {
      for (let j = 1; j <= len; j++) {
        const suffix = data.suffixes[word.substring(j)]
        if (suffix === undefined) continue
        const key = word.substring(0, j)
        if (this.dictionaryCache[key] === undefined) continue

        for (const base of this.dictionaryCache[key]) {
          const baseRMC = base.substring(base.length - 1)
          const suffixLMC = suffix.substring(0, 1)
          let fullWord = base

          if (isVowel(baseRMC) && isKar(suffixLMC)) {
            // Insert য় in between.
            fullWord += 'য়'
          } else if (baseRMC == 'ৎ') {
            // Replace ৎ with ত
            fullWord = base.substring(0, base.length - 1) + 'ত'
          } else if (baseRMC == 'ং') {
            // Replace ং with ঙ
            fullWord = base.substring(0, base.length - 1) + 'ঙ' + suffix
            // this shouldn't be added to tempCache(idk why ¯\_(ツ)_/¯)
            // continue to next
            list.push(fullWord)
            continue
          }

          fullWord += suffix

          list.push(fullWord)
          this.addToTempSuffixCache(fullWord, base, key)
        }
      }
    }

    return list
  }

  private getPreviousSelection(
    splitWord: SplitWord,
    suggestionWords: string[],
    userSelections: Record<string, string>
  ) {
    const word = splitWord['middle']
    const len = word.length
    let selectedWord = ''
    if (userSelections[word]) {
      selectedWord = userSelections[word]
    } else {
      //Full word was not found, try checking without suffix
      if (len >= 2) {
        for (let j = 1; j < len; j++) {
          const testSuffix = word.substring(word.length - j).toLowerCase()

          const suffix = data.suffixes[testSuffix]
          if (suffix) {
            const key = word.substring(0, word.length - testSuffix.length)

            if (userSelections[key]) {
              //Get possible words for key
              const keyWord = userSelections[key]

              const kwRightChar = keyWord.substring(word.length - -1)
              const suffixLeftChar = suffix.substring(0, 1)
              selectedWord = keyWord

              if (isVowel(kwRightChar) && isKar(suffixLeftChar))
                selectedWord += 'য়'
              else if (kwRightChar == 'ৎ')
                selectedWord = keyWord.substring(0, keyWord.length - 1) + 'ত'
              else if (kwRightChar == 'ং')
                selectedWord = keyWord.substring(0, keyWord.length - 1) + 'ঙ'

              selectedWord += suffix

              //Save this referrence
              userSelections[word] = selectedWord
              break
            }
          }
        }
      }
    }

    const i = suggestionWords.indexOf(selectedWord)
    return i < 0 ? 0 : i
  }

  isInSuffixCache(full: string) {
    return full in this.tempSuffixCache
  }

  getFromSuffixCache(full: string) {
    return this.tempSuffixCache[full]
  }

  suggest(input: string, userSelections: Record<string, string>) {
    //Separate beginning and trailing padding characters, punctuations etc. from whole word
    const splitWord = separatePadding(input)

    //Convert beginning and trailing padding text to phonetic Bangla
    splitWord.begin = this.phonetic.convert(splitWord.begin)
    splitWord.end = this.phonetic.convert(splitWord.end)

    //Convert the word to Bangla using 3 separate methods
    const phonetic = this.phonetic.convert(splitWord.middle)

    const word = splitWord.middle.toLowerCase()
    const dictSuggestion =
      this.dictionaryCache[word]?.slice(0) ?? dictSearch(word)

    const autoCorrect = this.getAutocorrect(input, splitWord)

    //Prepare suggestion object
    const words = new Set<string>()

    /* 1st Item: Autocorrect */
    if (autoCorrect !== null) {
      words.add(autoCorrect)
      //Add autocorrect entry to dictSuggestion for suffix support
      dictSuggestion.push(autoCorrect)
    }

    /* 2rd Item: Dictionary Avro Phonetic */
    //Update Phonetic Cache
    if (!this.dictionaryCache[word]) {
      if (dictSuggestion.length > 0) {
        this.dictionaryCache[word] = dictSuggestion.slice(0)
      }
    }
    //Add Suffix
    const dictSuggestionWithSuffix = this.addSuffix(
      splitWord.middle.toLowerCase()
    )

    const sortedWords = sortByPhoneticRelevance(
      phonetic,
      dictSuggestionWithSuffix
    )

    for (const word of sortedWords) {
      words.add(word)
      if (words.size >= 10) break
    }

    const candidates = [...words]
    const extra = []

    /* 3rd Item: Classic Avro Phonetic */
    if (!candidates.includes(phonetic))
      extra.push(postProcess(splitWord.begin + phonetic + splitWord.end))

    const candidatesWithPadding = candidates.map((word) =>
      postProcess(splitWord.begin + word + splitWord.end)
    )

    if (!candidatesWithPadding.includes(input)) {
      if (data.emoticons.has(input)) {
        candidates.unshift(input)
        candidatesWithPadding.unshift(input)
      } else if (!extra.includes(input)) {
        extra.push(input)
      }
    }

    const i = 10 - extra.length
    candidates.splice(i, candidates.length - i, ...extra)
    candidatesWithPadding.splice(i, candidatesWithPadding.length - i, ...extra)

    return {
      //Is there any previous custom selection of the user?
      prevSelection: this.getPreviousSelection(
        splitWord,
        candidates,
        userSelections
      ),
      //Add padding to all
      candidates: candidatesWithPadding,
      rawInput: input,
    }
  }

  suggestWithoutDictionary(input: string) {
    return {
      candidates: [postProcess(this.phonetic.convert(input))],
      prevSelection: 0,
      rawInput: input,
    }
  }
}

const correctCase = (banglish: string) =>
  banglish.replaceAll(/[oiudgjnrstyz]/gi, (c) => c.toLowerCase())

interface SplitWord {
  begin: string
  middle: string
  end: string
}

interface BaseWord {
  base: string
  eng: string
}

export const separatePadding = (input: string): SplitWord => {
  // Feeling lost? Ask Rifat :D
  const match =
    input.match(
      /(^(?::`|\.`|[-\]~!@#%&*()_=+[{}'";<>/?|.,])*?(?=(?:,{2,}))|^(?::`|\.`|[-\]~!@#%&*()_=+[{}'";<>/?|.,])*)(.*?(?:,,)*)((?::`|\.`|[-\]~!@#%&*()_=+[{}'";<>/?|.,])*$)/
    ) ?? []

  return {
    begin: match[1] ?? '',
    middle: match[2] ?? '',
    end: match[3] ?? '',
  }
}

const isKar = (char: string) =>
  /^[\u09be\u09bf\u09c0\u09c1\u09c2\u09c3\u09c7\u09c8\u09cb\u09cc\u09c4]$/.test(
    char
  )

const isVowel = (char: string) =>
  // eslint-disable-next-line no-misleading-character-class
  /^[\u0985\u0986\u0987\u0988\u0989\u098a\u098b\u098f\u0990\u0993\u0994\u098c\u09e1\u09be\u09bf\u09c0\u09c1\u09c2\u09c3\u09c7\u09c8\u09cb\u09cc]$/u.test(
    char
  )

const dictSearch = (enText: string) => {
  const re = new RegExp(`^${regexParse(enText)}$`)
  // list of tables to search based on left most char of enText
  const tableList = tableListMap[enText.toLowerCase().charAt(0)] ?? []
  const retWords = []

  for (const key of tableList) {
    for (const word of data.dictionary[key]) {
      if (re.test(word)) retWords.push(word)
    }
  }
  return retWords
}

const postProcess = (word: string) => {
  if (/^([\p{L}\p{M}]+।){2,}$/u.test(word)) {
    return word.replaceAll('।', '.')
  }
  return word
}

const sortByPhoneticRelevance = (phonetic: string, dictSuggestion: string[]) =>
  dictSuggestion.slice(0).sort((a: string, b: string) => {
    const da = distance(phonetic, a)
    const db = distance(phonetic, b)

    if (da < db) return -1
    else if (da > db) return 1
    else return 0
  })
