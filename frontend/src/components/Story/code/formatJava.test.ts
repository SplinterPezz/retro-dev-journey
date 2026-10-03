import { formatJava } from './formatJava';
import { sameCode } from './sameCode';

describe('formatJava', () => {
  it('indents by braces, four spaces per level', () => {
    expect(formatJava('class A {\nvoid f() {\nint x = 1;\n}\n}')).toBe(
      'class A {\n    void f() {\n        int x = 1;\n    }\n}'
    );
  });

  it('collapses runs of blank lines', () => {
    expect(formatJava('int a;\n\n\n\nint b;')).toBe('int a;\n\nint b;');
  });

  it('never goes below zero depth on stray braces', () => {
    expect(formatJava('}\nint a;')).toBe('}\nint a;');
  });
});

describe('sameCode', () => {
  it('ignores whitespace and line breaks', () => {
    expect(sameCode('int x = 1;', 'int  x=1 ;\n')).toBe(true);
    expect(sameCode('int x = 1;', 'int x = 2;')).toBe(false);
  });
});
