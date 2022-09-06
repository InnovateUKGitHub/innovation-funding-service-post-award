import { getFileSize, getFileExtension } from "./files";

describe("getFileSize()", () => {
  test.each`
    name               | bytes         | expected
    ${"less than 1KB"} | ${1023}       | ${"0.999KB"}
    ${"more than 1KB"} | ${1024}       | ${"1KB"}
    ${"1MB"}           | ${1048576}    | ${"1MB"}
    ${"more than 1MB"} | ${5000000}    | ${"4.768MB"}
    ${"over 1gb"}      | ${1048576000} | ${"1,000MB"}
  `("$name", ({ bytes, expected }) => {
    expect(getFileSize(bytes)).toBe(expected);
  });
});

describe("files", () => {
  describe("getFileExtension", () => {
    test.each`
      name                               | fileName                             | expected
      ${"empty file name"}               | ${""}                                | ${""}
      ${"file name with multiple dots"}  | ${"this.file.has.multiple.dots.txt"} | ${"txt"}
      ${"file name with file type"}      | ${"test.jpeg"}                       | ${"jpeg"}
      ${"file name with no file type"}   | ${"file"}                            | ${""}
      ${"file name in capitals"}         | ${"test.PDF"}                        | ${"pdf"}
      ${"file name with a trailing dot"} | ${"trailingdot."}                    | ${""}
    `("$name", ({ fileName, expected }) => {
      const ext = getFileExtension(fileName);
      expect(ext).toBe(expected);
    });
  });
});
