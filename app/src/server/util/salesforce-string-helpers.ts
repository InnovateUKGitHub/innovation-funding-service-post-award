export function parseSfLongTextArea(unParsedString: string): string[] {
  const stripLineEndingsRegex = /(?:\r\n|\r|\n)/g;

  const paragraphs: string[] = unParsedString.split(stripLineEndingsRegex);

  return paragraphs.reduce<string[]>((values, item) => {
    if (!item) return values;

    const tidyParagraph = item.trim();

    return [...values, tidyParagraph];
  }, []);
}
