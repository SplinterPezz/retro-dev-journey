/// <reference types="vite/client" />

// Variables read from .env files at build time (see vite.config.ts envPrefix).
interface ImportMetaEnv {
  readonly REACT_APP_ENV?: string;
  readonly REACT_APP_API_URL?: string;
  readonly REACT_APP_IUBENDA_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
