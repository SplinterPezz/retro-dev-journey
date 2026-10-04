const stripWhitespace = (code: string) => code.replace(/\s+/g, '');

export const sameCode = (a: string, b: string): boolean => stripWhitespace(a) === stripWhitespace(b);
