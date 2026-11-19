// Runtime checks for data that comes from outside (API responses): a value gets a type only once it passed one.
export type Guard<T> = (value: unknown) => value is T;

export const isRecord: Guard<Record<string, unknown>> = (value): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

export const isString: Guard<string> = (value): value is string => typeof value === 'string';

export const isNumber: Guard<number> = (value): value is number => typeof value === 'number';

export const listOf =
  <T,>(isItem: Guard<T>): Guard<T[]> =>
  (value): value is T[] =>
    Array.isArray(value) && value.every(isItem);

// one guard per field of T: a field added to the type without its check does not compile
export const shape =
  <T extends object>(fields: { [K in keyof T]: Guard<T[K]> }): Guard<T> =>
  (value): value is T => {
    if (!isRecord(value)) return false;
    for (const key in fields) {
      if (!fields[key](value[key])) return false;
    }
    return true;
  };
