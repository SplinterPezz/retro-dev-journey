// Not a Java parser: re-indents by braces, enough for the short mini-game snippets.
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
