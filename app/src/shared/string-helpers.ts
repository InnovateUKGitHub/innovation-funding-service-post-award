export const removeSpaces = (value: string, replacementValue = "") => value.trim().replace(/\s/g, replacementValue);

export const removeUndefinedString = (value: string): string => value.replace(/undefined/g, "");
