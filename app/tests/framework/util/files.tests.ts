import { getFileExtension } from "@framework/util/files";

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
