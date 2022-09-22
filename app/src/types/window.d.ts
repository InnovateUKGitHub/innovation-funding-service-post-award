import { i18n } from "i18next";

declare global {
  interface Window {
    __PRELOADED_STATE__: string;
    i18n: i18n;
  }
}
