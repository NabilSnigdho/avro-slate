export const cls = (...args: (undefined | null | string | boolean)[]) =>
  args
    .filter((x) => x !== undefined && x !== null && x !== '' && typeof x !== 'boolean')
    .join(' ')
