import { IFileWrapper } from "@framework/types";
import { Configuration } from "@server/features/common";
import { FileDtoValidator } from "@ui/validators";

describe("Document upload validator", () => {
  const allowedFileTypes = Configuration.options.permittedFileTypes;
  const maxFileSize = Configuration.options.maxFileSize;

  const createFile = (extension: string, givenSize: number = 10000): IFileWrapper => ({
    fileName: "test." + extension,
    size: givenSize,
  });

  describe("test file size", () => {
    test("when exceeding maximum", () => {
      const invalidFileSize = maxFileSize + 1;
      const file = createFile("pdf", invalidFileSize);

      const validator = new FileDtoValidator(file, maxFileSize, allowedFileTypes, false);
      expect(validator.errors[0].errorMessage).toEqual(
        "You cannot upload 'test.pdf' because it must be smaller than 10MB.",
      );
    });

    test("within tolerance", () => {
      const file = createFile("pdf");

      const validator = new FileDtoValidator(file, maxFileSize, allowedFileTypes, false);
      expect(validator.errors).toHaveLength(0);
    });

    test("when below minimum", () => {
      const file = {
        fileName: "test.pdf",
        size: 0,
      };

      const validator = new FileDtoValidator(file, maxFileSize, allowedFileTypes, false);
      expect(validator.errors[0].errorMessage).toEqual("You cannot upload 'test.pdf' because it is empty.");
    });
  });

  describe("test file extension", () => {
    describe("with allowed file", () => {
      test.each(allowedFileTypes)("with %s", fileType => {
        const validator = new FileDtoValidator(createFile(fileType), maxFileSize, allowedFileTypes, false);
        expect(validator.errors).toHaveLength(0);
      });
    });

    test("with disallowed file type", () => {
      const fileExtension = "an-invalid-filename-which-does-not-match";
      const validator = new FileDtoValidator(createFile(fileExtension), maxFileSize, allowedFileTypes, false);
      expect(validator.errors[0].errorMessage).toEqual(
        `You cannot upload 'test.${fileExtension}' because it is the wrong file type.`,
      );
    });
  });
});
