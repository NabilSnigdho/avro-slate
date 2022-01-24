import SuggestionBuilder, { separatePadding } from './suggestion-builder'

export default class AvroPhonetic {
  private buffer = ''
  private readonly suggestionBuilder
  private readonly userSelections: Record<string, string>

  constructor() {
    this.suggestionBuilder = new SuggestionBuilder()
    // Load user selections
    try {
      const selections = localStorage.getItem('AvroUserSelections')
      if (selections === null) {
        this.userSelections = Object.create(null)
      } else this.userSelections = JSON.parse(selections)
    } catch (err) {
      this.userSelections = Object.create(null)
      console.error(err, 'Error while loading user selections')
    }
  }

  private saveUserSelections() {
    try {
      localStorage.setItem(
        'AvroUserSelections',
        JSON.stringify(this.userSelections)
      )
    } catch (err) {
      console.error(err, 'Error while saving user selections')
    }
  }

  private addUserSelection(input: string, candidate: string) {
    // Seperate begining and trailing padding characters, punctuations etc. from whole word
    const splitWord = separatePadding(input)
    this.userSelections[splitWord.middle] = candidate
  }

  commit(input: string, candidate: string) {
    //If it is called, user made the final decision here
    this.addUserSelection(input, candidate)

    //Check and save selection without suffix if that is not present
    if (this.suggestionBuilder.isInSuffixCache(candidate)) {
      const { base, eng } = this.suggestionBuilder.getFromSuffixCache(candidate)
      //Don't overwrite existing value
      if (!this.userSelections[eng]) {
        this.userSelections[eng] = base
      }
    }

    this.saveUserSelections()
    this.closeInputSession()
  }

  get ongoingInputSession() {
    return this.buffer !== ''
  }
  closeInputSession() {
    this.buffer = ''
  }

  private suggest() {
    return this.suggestionBuilder.suggest(this.buffer, this.userSelections)
  }
  getSuggestionForKey(char: string) {
    this.buffer += char
    return this.suggest()
  }
  getSuggestionForBackspace() {
    const s = this.buffer
    this.buffer = s.substring(0, s.length - 1)
    if (this.buffer === '') return null
    return this.suggest()
  }
}
