const emptyArray = new Array<string>()
const emptyRecord: Record<string, string> = {}

export const data = {
  autocorrect: emptyRecord,
  suffixes: emptyRecord,
  emoticons: new Set<string>(),
  dictionary: {
    w_a: emptyArray,
    w_aa: emptyArray,
    w_i: emptyArray,
    w_ii: emptyArray,
    w_u: emptyArray,
    w_uu: emptyArray,
    w_rri: emptyArray,
    w_e: emptyArray,
    w_oi: emptyArray,
    w_o: emptyArray,
    w_ou: emptyArray,
    w_b: emptyArray,
    w_bh: emptyArray,
    w_c: emptyArray,
    w_ch: emptyArray,
    w_d: emptyArray,
    w_dh: emptyArray,
    w_dd: emptyArray,
    w_ddh: emptyArray,
    w_g: emptyArray,
    w_gh: emptyArray,
    w_h: emptyArray,
    w_j: emptyArray,
    w_jh: emptyArray,
    w_k: emptyArray,
    w_kh: emptyArray,
    w_l: emptyArray,
    w_m: emptyArray,
    w_n: emptyArray,
    w_nga: emptyArray,
    w_nya: emptyArray,
    w_nn: emptyArray,
    w_p: emptyArray,
    w_ph: emptyArray,
    w_r: emptyArray,
    w_rr: emptyArray,
    w_rrh: emptyArray,
    w_s: emptyArray,
    w_sh: emptyArray,
    w_ss: emptyArray,
    w_t: emptyArray,
    w_th: emptyArray,
    w_tt: emptyArray,
    w_tth: emptyArray,
    w_y: emptyArray,
    w_z: emptyArray,
    w_khandatta: emptyArray,
  },
}

export const tableListMap: Record<string, (keyof typeof data.dictionary)[]> = {
  a: ['w_a', 'w_aa', 'w_e', 'w_oi', 'w_o', 'w_nya', 'w_y'],
  b: ['w_b', 'w_bh'],
  c: ['w_c', 'w_ch', 'w_k'],
  d: ['w_d', 'w_dh', 'w_dd', 'w_ddh'],
  e: ['w_i', 'w_ii', 'w_e', 'w_y'],
  f: ['w_ph'],
  g: ['w_g', 'w_gh', 'w_j'],
  h: ['w_h'],
  i: ['w_i', 'w_ii', 'w_y'],
  j: ['w_j', 'w_jh', 'w_z'],
  k: ['w_k', 'w_kh'],
  l: ['w_l'],
  m: ['w_h', 'w_m'],
  n: ['w_n', 'w_nya', 'w_nga', 'w_nn'],
  o: ['w_a', 'w_u', 'w_uu', 'w_oi', 'w_o', 'w_ou', 'w_y'],
  p: ['w_p', 'w_ph'],
  q: ['w_k'],
  r: ['w_rri', 'w_h', 'w_r', 'w_rr', 'w_rrh'],
  s: ['w_s', 'w_sh', 'w_ss'],
  t: ['w_t', 'w_th', 'w_tt', 'w_tth', 'w_khandatta'],
  u: ['w_u', 'w_uu', 'w_y'],
  v: ['w_bh'],
  w: ['w_o'],
  x: ['w_e', 'w_k'],
  y: ['w_i', 'w_y'],
  z: ['w_h', 'w_j', 'w_jh', 'w_z'],
}

export const fetchDictionaryData = () =>
  Promise.all([
    fetch(import.meta.env.BASE_URL + 'data/autocorrect.json')
      .then((res) => res.json())
      .then((res) => {
        data.autocorrect = res
      }),
    fetch(import.meta.env.BASE_URL + 'data/suffixes.json')
      .then((res) => res.json())
      .then((res) => {
        data.suffixes = res
      }),
    fetch(import.meta.env.BASE_URL + 'data/emoticons.json')
      .then((res) => res.json())
      .then((res) => {
        data.emoticons = new Set(res)
      }),
    fetch(import.meta.env.BASE_URL + 'data/dictionary.json')
      .then((res) => res.json())
      .then((res) => {
        data.dictionary = res
      }),
  ])
