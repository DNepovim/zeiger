export const getObjectPart = <T, D extends keyof T>(
  obj: T,
  keys: D[],
): Pick<T, (typeof keys)[number]> =>
  keys.reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {} as Pick<T, (typeof keys)[number]>)
