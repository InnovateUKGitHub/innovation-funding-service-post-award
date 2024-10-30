export type Enum = { [key: string | number]: string | number };

type EnumNumerical<T extends Enum> = {
  [K in keyof T]: T[K] extends number ? T[K] : never;
};

type ObjectValues<T extends { [key: string]: number }, K = keyof T> = [K] extends [keyof T]
  ? [K] extends [never]
    ? []
    : T[K][]
  : never;

export type EnumValues<T extends Enum> = ObjectValues<EnumNumerical<T>>;

/**
 * Gets the numerical enum values. Does not respond for string-type enums
 */
export const getAllNumericalEnumValues = <T extends Enum>(enumType: T): EnumValues<T> => {
  return Object.values(enumType).filter(k => typeof k === "number") as EnumValues<T>;
};
