// Re-indents Java code by its braces, four spaces per level, and drops blank
// runs. It does not parse Java: it is enough for the short snippets in the
// mini games, where the answer is compared ignoring whitespace anyway.
export const formatJava = (code: string): string => {
  let depth = 0;
  const lines = code.split('\n').map((raw) => {
    const line = raw.trim();
    if (!line) return '';
    const leadingClose = line.startsWith('}') ? 1 : 0;
    depth = Math.max(0, depth - leadingClose);
    const indented = '    '.repeat(depth) + line;
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    depth = Math.max(0, depth + opens - (closes - leadingClose));
    return indented;
  });
  return lines.filter((l, i) => l !== '' || (i > 0 && lines[i - 1] !== '')).join('\n').trim();
};
