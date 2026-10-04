
export const isDev: boolean = import.meta.env.REACT_APP_ENV === 'development';

export const isProdBuild: boolean = import.meta.env.PROD;

export const apiBaseUrl: string = import.meta.env.REACT_APP_API_URL || '';

export const devLog = (...args: unknown[]): void => {
  if (isDev) console.log(...args);
};

export const devError = (...args: unknown[]): void => {
  if (isDev) console.error(...args);
};

export const iubendaPolicyId: string = import.meta.env.REACT_APP_IUBENDA_ID || '';
