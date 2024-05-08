declare namespace Express {
  export interface Locals {
    nonce: string;
    isMatchedRoute?: boolean;
    isFormSuccess?: boolean;
    requestId: string;
    preloadedReduxActions: { type: string; payload?: unknown }[];
  }
}
