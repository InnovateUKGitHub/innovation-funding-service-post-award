export const baseLorem =
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

export const loremIpsum10Char = getLorem(10);
export const loremIpsum20Char = getLorem(20);
export const loremIpsum40Char = getLorem(40);
export const loremIpsum50Char = getLorem(50);
export const loremIpsum21Char = getLorem(21);
export const loremIpsum41Char = getLorem(41);
export const loremIpsum51Char = getLorem(51);
export const loremIpsum100Char = getLorem(100);
export const loremIpsum159Char = getLorem(159);
export const loremIpsum255Char = getLorem(255);
export const loremIpsum256Char = getLorem(256);
export const loremIpsum1k = getLorem(1_000);
export const loremIpsum2k = getLorem(2_000);
export const loremIpsum10k = getLorem(10_000);
export const loremIpsum16k = getLorem(16_000);
export const loremIpsum30k = getLorem(30_000);
export const loremIpsum32k = getLorem(32_000);
export const loremIpsum33k = getLorem(32_769);
export const loremIpsum131k = getLorem(131_072);
