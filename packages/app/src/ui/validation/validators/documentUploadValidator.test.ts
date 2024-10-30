import { IFileWrapper } from "@framework/types/fileWrapper";
import { configuration } from "@server/features/common/config";
import { initFullTestIntl, initStubTestIntl } from "@shared/initStubTestIntl";
import { FileDtoValidator } from "./documentUploadValidator";

describe("Document upload validator", () => {
  const createFile = (extension: string, givenSize = 10000, fileName = "test"): IFileWrapper => ({
    fileName: fileName + "." + extension,
    size: givenSize,
  });

  describe.each(["en-GB", "no"])("With %s i18n", language => {
    beforeAll(async () => {
      if (language === "en-GB") {
        await initFullTestIntl();
      } else {
        await initStubTestIntl();
      }
    });

    describe("test file name", () => {
      describe("valid file names", () => {
        test.each`
          name                      | fileName
          ${"lowercase characters"} | ${"abc"}
          ${"uppercase characters"} | ${"ABC"}
          ${"digits"}               | ${"0123"}
          ${"whitespace"}           | ${"abc abc"}
          ${"dot"}                  | ${"abc.abc"}
          ${"underscore"}           | ${"_"}
          ${"dash"}                 | ${"-"}
          ${"parenthesis"}          | ${"()"}
          ${"past invalid chars"}   | ${"!'@£$%^&{}[]`~;#"}
        `("$name", ({ fileName }) => {
          const file = createFile("doc", 10000, fileName);

          const validator = new FileDtoValidator(file, configuration.options, false);
          expect(validator.isValid).toBe(true);
        });
      });
    });

    const invalidNameCharacters = "\\";

    describe("invalid file names", () => {
      const invalidList = invalidNameCharacters.split("");
      invalidList.forEach(invalidChar => {
        test("containing invalid character: " + invalidChar, () => {
          const file = createFile("doc", 10000, "invalid_file_name" + invalidChar);
          const validator = new FileDtoValidator(file, configuration.options, false);
          expect(validator.errors).toHaveLength(1);
          expect(validator.errors[0].errorMessage).toMatchSnapshot();
        });
      });
    });

    describe("test file size", () => {
      test("when exceeding maximum", () => {
        const invalidFileSize = configuration.options.maxFileSize + 1;
        const file = createFile("pdf", invalidFileSize);

        const validator = new FileDtoValidator(file, configuration.options, false);
        expect(validator.errors[0].errorMessage).toMatchSnapshot();
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
        expect(validator.errors[0].errorMessage).toMatchSnapshot();
      });
    });

    describe("test file extension", () => {
      describe("with allowed file", () => {
        test.each(Object.values(configuration.options.permittedTypes).flat())("with %s", fileType => {
          const validator = new FileDtoValidator(createFile(fileType), configuration.options, false);
          expect(validator.errors).toHaveLength(0);
        });
      });

      test("with disallowed file type", () => {
        const fileExtension = "an-invalid-filename-which-does-not-match";
        const validator = new FileDtoValidator(createFile(fileExtension), configuration.options, false);
        expect(validator.errors[0].errorMessage).toMatchSnapshot();
      });
    });
  });
});
