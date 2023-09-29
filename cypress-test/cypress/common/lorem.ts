const baseLorem =
  "If you ever need a reason to go to the office in Swindon, consider the fact that every third wednesday of the month, Pippin's donuts comes into the office and sells its lovely goods.\n";

/**
 * Generate a lorem-ipsum string.
 * @param chars Number of characters in your lorem ipsum string
 * @returns A string with the specified number of characters.
 */
const getLorem = (chars: number): string => {
  const repeats = Math.floor(chars / baseLorem.length);
  const leftOver = chars % baseLorem.length;

  return baseLorem.repeat(repeats) + baseLorem.substring(0, leftOver);
};

export const loremIpsum2k = getLorem(2_000);
export const loremIpsum10k = getLorem(10_000);
export const loremIpsum30k = getLorem(30_000);
export const loremIpsum32k = getLorem(32_000);
