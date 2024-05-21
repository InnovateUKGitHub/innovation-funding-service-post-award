declare namespace Express {
  export interface Locals {
    nonce: string;
    isMatchedRoute?: boolean;
    isFormSuccess?: boolean;
    preloadedReduxActions: { type: string; payload?: unknown }[];
    messages: string[];
  }
}
