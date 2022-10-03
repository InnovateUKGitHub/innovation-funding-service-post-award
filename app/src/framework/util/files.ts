import bytes from "bytes";
import sanitize from "sanitize-filename";

const bytesInOneMb = bytes("1mb"); // Note: this is in base 2 (i.e. 1kb = 1024 bytes)

export function getFileSize(fileSizeBytes: number): string {
  const displayMb = fileSizeBytes >= bytesInOneMb;
  const unit = displayMb ? "MB" : "KB"; // Note: we don't need to support Bytes/GB

  return bytes.format(fileSizeBytes, {
    decimalPlaces: 0,
    thousandsSeparator: ",",
    unit,
  });
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
