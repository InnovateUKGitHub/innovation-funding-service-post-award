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

declare const __nominal__type: unique symbol;

declare type Nominal<Type, Identifier> = Type & {
  readonly [__nominal__type]: Identifier;
};

declare type Mutable<T extends object> = {
  -readonly [Key in keyof T]: T[Key];
};

/**
 * will show the intersecting elements of two union types, or never if no intersection
 *
 * @see https://github.com/piotrwitek/utility-types#setintersectiona-b-same-as-extract
 */
declare type SetIntersection<A, B> = A extends B ? A : never;

/**
 * Evaluates the expected additional data object as used in the `mapPartnerDto.ts` file., based on the required fields from te dto
 * 
 * The TAdditionalData format is an array of tuples  where the first element is the element to look for in the picklist,
 * the second element is the property key to be used in the additional data object and the third is the type of the additional data.
 * 
 * @example
 
  // where TPickList = "roles" | "competitionName" | "id" | "name"
 
  additionalData: AdditionalDataType<
    TPickList,
    [["roles", "partnerRoles", SfPartnerRoles[]], ["competitionName", "competitionName", string]]
  >
 
   // then the expected additionalData object might be
 
  const partners = mapToPartnerDtoArray(
    partnersGql,
    [
      "id",
      "name"
      "competitionName",
      "roles",
    ],
    { competitionName: project.competitionName, partnerRoles: project.roles.partnerRoles },
  );
 */
declare type AdditionalDataType<
  TPickList,
  TAdditionalData extends [keyNameFromPickList: string, additionalDataObjectKey: string, additionalDataType: unknown][],
> = SetIntersection<TPickList, TAdditionalData[number][0]> extends never
  ? EmptyObject
  : {
      [P in TAdditionalData[number] as P[0] extends TPickList ? P[1] : never]: P[2];
    };
