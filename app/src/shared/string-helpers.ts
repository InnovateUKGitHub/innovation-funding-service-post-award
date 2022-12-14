export const removeSpaces = (value: string, replacementValue = "") => value.trim().replace(/\s/g, replacementValue);

export const removeUndefinedString = (value: string): string => value.replace(/undefined/g, "");

export const capitalizeFirstWord = (str: string) =>
  str.toLowerCase().replace(/^(\w)(.*)$/, (m, p1, p2) => `${p1.toUpperCase()}${p2}`);
