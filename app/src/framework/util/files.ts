import sanitize from "sanitize-filename";

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

export function getFileExtension(fullFileName: string): string {
  const dotIndex = fullFileName.lastIndexOf(".");
  return dotIndex > 0 ? fullFileName.substr(dotIndex + 1).toLocaleLowerCase() : "";
}

export function getFileName(fullFileName: string): string {
  const startOfFileExtension = fullFileName.lastIndexOf(".");
  const fileName = startOfFileExtension > 0 ? fullFileName.substr(0, startOfFileExtension) : fullFileName;
  return sanitize(fileName);
}
