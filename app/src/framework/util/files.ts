import { IFileWrapper } from "@framework/types";

const options = {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2
};

export function getFileSize(size: number, unitNotation: "B" | "KB" | "MB" | "GB" = "B"): string {
  const units: ["B", "KB", "MB", "GB"] = ["B", "KB", "MB", "GB"];

  if (size < 1000 || unitNotation === "GB") {
    return `${new Intl.NumberFormat("en-GB", options).format(size)}${unitNotation}`;
  }

  const nextUnit = units[units.indexOf(unitNotation) + 1];
  return getFileSize(size / 1024, nextUnit);
}

export function getFileExtension(file: IFileWrapper | null | undefined) {
  return file && file.fileName.indexOf(".") >= 0 ? file.fileName.split(".").pop() : "";
}
