declare type EmptyObject = Record<string, never>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare type AnyObject = Record<string, any>;

declare type Merge<A, B> = A extends EmptyObject
  ? B
  : B extends EmptyObject
  ? A
  : { [P in keyof A | keyof B]: P extends keyof A ? A[P] : P extends keyof B ? B[P] : never };

declare type ContentJson = { [key: string]: string | ContentJson };

declare type ResultBase = AnyObject | null;

declare type Nullable<T> = T | null | undefined;

// https://stackoverflow.com/a/53050575
declare type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>;
};

declare type UnwrapArray<T> = T extends Array<infer U> ? U : T extends ReadonlyArray<infer V> ? V : never;

// https://stackoverflow.com/a/47914631
type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};
