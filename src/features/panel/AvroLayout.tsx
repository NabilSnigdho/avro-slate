import React from 'react'
import { BsSquareFill } from 'react-icons/bs'

const caseInsensitive = 'text-pink-700 dark:text-pink-400'

const C = ({ v }: { v: string }) => <span className={caseInsensitive}>{v}</span>

const consonants = [
  { bn: 'ক', en: <C v="k" /> },
  { bn: 'খ', en: <C v="kh" /> },
  { bn: 'গ', en: <C v="g" /> },
  { bn: 'ঘ', en: <C v="gh" /> },
  { bn: 'ঙ', en: 'Ng' },
  { bn: 'চ', en: 'c' },
  { bn: 'ছ', en: 'ch' },
  { bn: 'জ', en: 'j' },
  { bn: 'ঝ', en: 'jh' },
  { bn: 'ঞ', en: 'NG' },
  { bn: 'ট', en: 'T' },
  { bn: 'ঠ', en: 'Th' },
  { bn: 'ড', en: 'D' },
  { bn: 'ঢ', en: 'Dh' },
  { bn: 'ণ', en: 'N' },
  { bn: 'ত', en: 't' },
  { bn: 'থ', en: 'th' },
  { bn: 'দ', en: 'd' },
  { bn: 'ধ', en: 'dh' },
  { bn: 'ন', en: 'n' },
  { bn: 'প', en: <C v="p" /> },
  {
    bn: 'ফ',
    en: (
      <>
        <C v="ph" />, <C v="f" />
      </>
    ),
  },
  { bn: 'ব', en: <C v="b" /> },
  { bn: 'ভ', en: <C v="bh, v" /> },
  { bn: 'ম', en: <C v="m" /> },
  { bn: 'য', en: 'z' },
  { bn: 'র', en: 'r' },
  { bn: 'ল', en: <C v="l" /> },
  { bn: 'শ', en: 'sh, S' },
  { bn: 'ষ', en: 'Sh' },
  { bn: 'স', en: 's' },
  { bn: 'হ', en: <C v="h" /> },
  { bn: 'ড়', en: 'R' },
  { bn: 'ঢ়', en: 'Rh' },
  {
    bn: 'য়',
    en: (
      <>
        <C v="y" />, Y
      </>
    ),
  },
  { bn: 'ৎ', en: 't``' },
  { bn: '\u0982', en: 'ng' },
  { bn: '\u0983', en: ':' },
  { bn: '\u0981', en: '^' },
]

const vowels = [
  { bn: 'অ', kar: '', en: 'o' },
  { bn: 'আ', kar: '\u09BE', en: <C v="a" /> },
  { bn: 'ই', kar: '\u09BF', en: 'i' },
  { bn: 'ঈ', kar: '\u09C0', en: 'I' },
  { bn: 'উ', kar: '\u09C1', en: 'u' },
  { bn: 'ঊ', kar: '\u09C2', en: 'U' },
  { bn: 'ঋ', kar: '\u09C3', en: 'rri' },
  { bn: 'এ', kar: '\u09C7', en: 'e' },
  { bn: 'ঐ', kar: '\u09C8', en: 'OI' },
  { bn: 'ও', kar: '\u09CB', en: 'O' },
  { bn: 'ঔ', kar: '\u09CC', en: 'OU' },
]

const folas = [
  { bn: 'ব (ফলা)', en: <C v="w" /> },
  {
    bn: '\u09CDয - য ফলা',
    en: (
      <>
        (c)
        <C v="y" />, Z
      </>
    ),
  },
  { bn: '\u09CDর - র ফলা', en: '(c)r' },
  { bn: 'রেফ', en: '(v)rr(c)' },
]

const punctuations = [
  { bn: '\u09CD - হসন্ত', en: ',,' },
  { bn: '। - দাড়ি', en: '.' },
  { bn: '৳ - টাকা', en: '$' },
  { bn: '. - ডট', en: '.`' },
  { bn: ': (কোলন)', en: ':`' },
]

const numbers = [
  { bn: '০', en: '0' },
  { bn: '১', en: '1' },
  { bn: '২', en: '2' },
  { bn: '৩', en: '3' },
  { bn: '৪', en: '4' },
  { bn: '৫', en: '5' },
  { bn: '৬', en: '6' },
  { bn: '৭', en: '7' },
  { bn: '৮', en: '8' },
  { bn: '৯', en: '9' },
]

export const AvroLayout = React.memo(() => {
  return (
    <section className="h-[14.375rem] p-1 grid grid-rows-[auto,1fr] overflow-y-auto bg-stone-50 dark:bg-stone-900">
      <h1 className="text-lg text-center">
        {'Avro Phonetic Layout © '}
        <a href="https://www.omicronlab.com/">OmicronLab</a>
      </h1>
      <div className="grid xl:grid-cols-[16fr,12fr,3fr,3fr] gap-1 text-sm justify-center">
        <div className="grid md:(grid-flow-col grid-rows-5 grid-cols-none) sm:grid-cols-10 <sm:grid-cols-5 gap-1">
          {consonants.map(({ bn, en }) => (
            <div key={bn} className="inline-flex items-center gap-x-1">
              <span className="bg-stone-300 dark:bg-stone-700 p-1 basis-1/2 text-center rounded-l">
                {bn}
              </span>
              <span className="whitespace-nowrap">{en}</span>
            </div>
          ))}
        </div>
        <div className="grid xl:(grid-flow-col grid-rows-5 grid-cols-none) lg:grid-cols-6 sm:grid-cols-5 <sm:grid-cols-3 gap-1">
          {vowels.map(({ bn, kar, en }) => (
            <div key={bn} className="inline-flex items-center gap-x-1">
              <span className="bg-stone-200 dark:bg-stone-600 p-1 basis-2/3 rounded-l inline-flex justify-between">
                <span>{bn}</span>
                <span>{kar}</span>
              </span>
              <span>{en}</span>
            </div>
          ))}
          {folas.map(({ bn, en }) => (
            <div key={bn} className="inline-flex items-center gap-x-1">
              <span className="bg-stone-300 dark:bg-stone-700 p-1 basis-3/5 whitespace-nowrap text-center rounded-l">
                {bn}
              </span>
              <span>{en}</span>
            </div>
          ))}
          {punctuations.map(({ bn, en }) => (
            <div key={bn} className="inline-flex items-center gap-x-1">
              <span className="bg-stone-300 dark:bg-stone-700 p-1 basis-2/3 whitespace-nowrap text-center rounded-l">
                {bn}
              </span>
              <span>{en}</span>
            </div>
          ))}
        </div>
        <div className="grid xl:(grid-flow-col grid-rows-5 grid-cols-none) sm:grid-cols-10 <sm:grid-cols-5 gap-1">
          {numbers.map(({ bn, en }) => (
            <div key={bn} className="inline-flex items-center gap-x-1">
              <span className="bg-stone-300 dark:bg-stone-700 p-1 basis-1/2 text-center rounded-l">
                {bn}
              </span>
              <span>{en}</span>
            </div>
          ))}
        </div>
        <div>
          <dl className="grid grid-cols-[auto,1fr] gap-1 items-center p-1 border-2 rounded border-stone-300 dark:border-stone-700 text-xs">
            <dt className={caseInsensitive}>
              <BsSquareFill />
            </dt>
            <dd>Case insensitive</dd>
            <dt>(v)</dt>
            <dd>Any vowel</dd>
            <dt>(c)</dt>
            <dd>Suitable Consonant</dd>
          </dl>
        </div>
      </div>
    </section>
  )
})
