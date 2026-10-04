/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly REACT_APP_ENV?: string;
  readonly REACT_APP_API_URL?: string;
  readonly REACT_APP_IUBENDA_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
