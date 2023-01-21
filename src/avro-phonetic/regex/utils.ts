/*
    =============================================================================
    *****************************************************************************
    The contents of utils file are subject to the Mozilla Public License
    Version 1.1 (the "License"); you may not use utils file except in
    compliance with the License. You may obtain a copy of the License at
    http://www.mozilla.org/MPL/

    Software distributed under the License is distributed on an "AS IS"
    basis, WITHOUT WARRANTY OF ANY KIND, either express or implied. See the
    License for the specific language governing rights and limitations
    under the License.

    The Original Code is jsAvroPhonetic

    The Initial Developer of the Original Code is
    Mehdi Hasan Khan <mhasan@omicronlab.com>
    Rifat Nabi <to.rifat@gmail.com>

    Copyright (C) OmicronLab (http://www.omicronlab.com). All Rights Reserved.


    Contributor(s): ______________________________________.

    *****************************************************************************
    =============================================================================
*/

export const fixString = (input: string) =>
  input
    .split('')
    .filter((c) => !isIgnore(c))
    .join('')

export const convertToUnicodeValue = (input: string) =>
  input.replaceAll(/\P{ASCII}/gu, (c) => `\\u0${c.charCodeAt(0).toString(16)}`)

export const isVowel = (c: string) => 'aeiou'.includes(c.toLowerCase())

export const isConsonant = (c: string) =>
  'bcdfghjklmnpqrstvwxyz'.includes(c.toLowerCase())

export const isPunctuation = (c: string) => !(isVowel(c) || isConsonant(c))

export const isExact = (
  needle: string,
  heystack: string,
  start: number,
  end: number
) =>
  start >= 0 &&
  end < heystack.length &&
  heystack.substring(start, end) === needle

export const isIgnore = (c: string) =>
  '|()[]{}^$*+?.~!@#%&-_=\'";<>/\\,:`'.includes(c.toLowerCase())
