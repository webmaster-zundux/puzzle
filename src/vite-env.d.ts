/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USE_DIV_AS_DIALOG_CONTAINER: string;
  readonly VITE_USE_DIV_AS_DIALOG_CONTAINER_WITH_TAB_TRAP: string;
  readonly VITE_TESTING_CHALLENGE_ID_GENERATION_EXPOSE_TO_WINDOW_OBJECT: string;
  readonly VITE_USE_DISPLAY_POINTER_INFORMATION: string;
  readonly VITE_TESTING_EXPOSE_DISPLAY_POINTER_INFORMATION: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
