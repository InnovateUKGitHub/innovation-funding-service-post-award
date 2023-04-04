const stripPkcsKey = (key: string) =>
  key
    .replaceAll(/-----([\w ]+)-----/g, "")
    .replaceAll("\n", "")
    .trim();

export { stripPkcsKey };
