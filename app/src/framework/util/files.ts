const options = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
};

export function getFileSize(
  size: number,
  unitNotation: string = "B",
  units: string[] = ["B", "KB", "MB", "GB"],
): string {
  if (size < 1000 || unitNotation === "GB") {
    const numFormat = new Intl.NumberFormat("en-GB", options).format(size);
    return `${numFormat}${unitNotation}`;
  }

  const nextUnit = units[units.indexOf(unitNotation) + 1];
  return getFileSize(size / 1024, nextUnit);
}

export function getFileExtension(fileName: string): string {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex > 0 ? fileName.substr(dotIndex + 1).toLocaleLowerCase() : "";
}
