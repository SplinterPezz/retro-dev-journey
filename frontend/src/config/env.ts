// Build-time environment flags (CRA inlines process.env.REACT_APP_* at build).

export const isDev: boolean = process.env.REACT_APP_ENV === 'development';

export const apiBaseUrl: string = process.env.REACT_APP_API_URL || '';

// console.log that only runs in development builds.
export const devLog = (...args: unknown[]): void => {
  if (isDev) console.log(...args);
};

export const devError = (...args: unknown[]): void => {
  if (isDev) console.error(...args);
};
