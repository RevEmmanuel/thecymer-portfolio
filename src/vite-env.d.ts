/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional form endpoint (Formspree, Web3Forms, Getform, your own API). See README. */
  readonly VITE_FORM_ENDPOINT?: string;
  /** Optional access key sent as `access_key` (Web3Forms style). */
  readonly VITE_FORM_ACCESS_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
