declare type EmptyObject = Record<string, never>;

declare type AnyObject = Record<string, any>;

declare type Merge<A, B> = A extends EmptyObject
  ? B
  : B extends EmptyObject
  ? A
  : { [P in keyof A | keyof B]: P extends keyof A ? A[P] : P extends keyof B ? B[P] : never };

declare type ContentJson = { [key: string]: string | ContentJson };

declare type ResultBase = AnyObject | null;
