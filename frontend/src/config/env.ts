// Build-time environment flags: Vite inlines import.meta.env.REACT_APP_* at
// build (envPrefix in vite.config.ts), read from the .env file of the build.

export const isDev: boolean = import.meta.env.REACT_APP_ENV === 'development';

export const apiBaseUrl: string = import.meta.env.REACT_APP_API_URL || '';

// console.log that only runs in development builds.
export const devLog = (...args: unknown[]): void => {
  if (isDev) console.log(...args);
};

export const devError = (...args: unknown[]): void => {
  if (isDev) console.error(...args);
};

export const iubendaPolicyId: string = import.meta.env.REACT_APP_IUBENDA_ID || '';
