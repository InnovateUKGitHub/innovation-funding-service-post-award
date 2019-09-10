// it would be nice to be able to constrain and infer this function but not sure how to in typescript currently.
export const getAllEnumValues = <T extends number>(enumType: any): T[] => {
  return Object.keys(enumType)
      // filter to values - value prop returns the name
      .filter(k => typeof (enumType[k]) === "string")
      // convert to enum rather than string
      .map(x => parseInt(x, 10) as T)
      ;
};
