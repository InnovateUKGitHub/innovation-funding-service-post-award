import { getFileSize, getFileExtension, getFileName } from "./files";

describe("getFileSize()", () => {
  test.each`
    name               | bytes         | expected
    ${"less than 1KB"} | ${1023}       | ${"1KB"}
    ${"more than 1KB"} | ${1024}       | ${"1KB"}
    ${"1MB"}           | ${1048576}    | ${"1MB"}
    ${"more than 1MB"} | ${5000000}    | ${"5MB"}
    ${"over 1gb"}      | ${1048576000} | ${"1,000MB"}
  `("$name", ({ bytes, expected }) => {
    expect(getFileSize(bytes)).toBe(expected);
  });
});

describe("files", () => {
  describe("getFileName / getFileExtension", () => {
    test.each`
      name                               | fileName                             | basename                         | extension
      ${"empty file name"}               | ${""}                                | ${""}                            | ${""}
      ${"file name with multiple dots"}  | ${"this.file.has.multiple.dots.txt"} | ${"this.file.has.multiple.dots"} | ${"txt"}
      ${"file name with file type"}      | ${"test.jpeg"}                       | ${"test"}                        | ${"jpeg"}
      ${"file name with no file type"}   | ${"file"}                            | ${"file"}                        | ${""}
      ${"file name in capitals"}         | ${"test.PDF"}                        | ${"test"}                        | ${"pdf"}
      ${"file name with a trailing dot"} | ${"trailingdot."}                    | ${"trailingdot"}                 | ${""}
      ${"file name with a starting dot"} | ${".helloworld.pptx"}                | ${".helloworld"}                 | ${"pptx"}
      ${"file name with many dots"}      | ${".ktp..tar.gz"}                    | ${".ktp..tar"}                   | ${"gz"}
      ${"file name with no basename"}    | ${".gitignore"}                      | ${".gitignore"}                  | ${""}
    `("$name", ({ fileName, basename, extension }) => {
      const ext = getFileExtension(fileName);
      const bas = getFileName(fileName);
      expect(ext).toBe(extension);
      expect(bas).toBe(basename);
    });
  });
});
