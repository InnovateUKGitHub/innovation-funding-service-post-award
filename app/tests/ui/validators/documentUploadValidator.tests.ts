import { IFileWrapper } from "@framework/types";
import { configuration } from "@server/features/common";
import { FileDtoValidator } from "@ui/validators";

describe("Document upload validator", () => {
  const createFile = (extension: string, givenSize = 10000, fileName = "test"): IFileWrapper => ({
    fileName: fileName + "." + extension,
    size: givenSize,
  });

  describe("test file name", () => {
    describe("valid file names", () => {
      test.each`
        name                      | fileName
        ${"lowercase characters"} | ${"abc"}
        ${"uppercase characters"} | ${"ABC"}
        ${"digits"}               | ${"0123"}
        ${"whitepsace"}           | ${"abc abc"}
        ${"backslash"}            | ${"abc\\abc"}
        ${"dot"}                  | ${"abc.abc"}
        ${"underscore"}           | ${"_"}
        ${"dash"}                 | ${"-"}
        ${"parenthesis"}          | ${"()"}
      `("$name", ({ fileName }) => {
        const file = createFile("doc", 10000, fileName);

        const validator = new FileDtoValidator(file, configuration.options, false);
        expect(validator.isValid).toBe(true);
      });
    });

    const invalidNameCharacters = "!'@£$%^&{}[]`~;#";

    describe("invalid file names", () => {
      const invalidList = invalidNameCharacters.split("");
      invalidList.forEach(invalidChar => {
        test("containing invalid character: " + invalidChar, () => {
          const file = createFile("doc", 10000, "invalid_file_name" + invalidChar);

          const validator = new FileDtoValidator(file, configuration.options, false);
          expect(validator.errors).toHaveLength(1);
          expect(validator.errors[0].errorMessage).toBe(
            `You cannot upload '${file.fileName}' because it contains forbidden characters.`,
          );
        });
      });
    });
  });

  describe("test file size", () => {
    test("when exceeding maximum", () => {
      const invalidFileSize = configuration.options.maxFileSize + 1;
      const file = createFile("pdf", invalidFileSize);

      const validator = new FileDtoValidator(file, configuration.options, false);
      expect(validator.errors[0].errorMessage).toEqual(
        "You cannot upload 'test.pdf' because it must be smaller than 32MB.",
      );
    });

    test("within tolerance", () => {
      const file = createFile("pdf");

      const validator = new FileDtoValidator(file, configuration.options, false);
      expect(validator.errors).toHaveLength(0);
    });

    test("when below minimum", () => {
      const file = {
        fileName: "test.pdf",
        size: 0,
      };

      const validator = new FileDtoValidator(file, configuration.options, false);
      expect(validator.errors[0].errorMessage).toEqual("You cannot upload 'test.pdf' because it is empty.");
    });
  });

  describe("test file extension", () => {
    describe("with allowed file", () => {
      test.each(configuration.options.permittedFileTypes)("with %s", fileType => {
        const validator = new FileDtoValidator(createFile(fileType), configuration.options, false);
        expect(validator.errors).toHaveLength(0);
      });
    });

    test("with disallowed file type", () => {
      const fileExtension = "an-invalid-filename-which-does-not-match";
      const validator = new FileDtoValidator(createFile(fileExtension), configuration.options, false);
      expect(validator.errors[0].errorMessage).toEqual(
        `You cannot upload 'test.${fileExtension}' because it is the wrong file type.`,
      );
    });
  });
});
