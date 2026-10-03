// Code answers are compared ignoring all whitespace, so indentation and line
// breaks never make a correct fix wrong.
const stripWhitespace = (code: string) => code.replace(/\s+/g, '');

export const sameCode = (a: string, b: string): boolean => stripWhitespace(a) === stripWhitespace(b);
