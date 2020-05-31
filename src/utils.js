const _pipe = (f, g) =>
  (...args) =>
    g(f(...args))

export const pipe = (...fns) =>
  fns.reduce(_pipe)

export const partial = (fn, ...presetArgs) =>
  (...laterArgs) =>
    fn(...presetArgs, ...laterArgs)