import bytes from "bytes";
import { render } from "@testing-library/react";
import { TestBed, TestBedStore } from "@shared/TestBed";
import { DocumentGuidance } from "@ui/components";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("<DocumentGuidance />", () => {
  const stubStore = {
    config: {
      getConfig: () => ({
        options: {
          maxFileSize: 1024,
        },
      }),
    },
  };

  const stubContent = {
    components: {
      documentGuidance: {
        uploadGuidance: "stub-uploadGuidance",
        uniqueFileName: "stub-uniqueFilename",
        noFilesNumberLimit: "stub-noFilesNumberLimit",
        fileSize: "stub-fileSize: {{maxFileSize}}",
        fileTypesUpload: "stub-fileTypesUpload",
        pdfFiles: "stub-pdfFiles",
        textFiles: "stub-textFiles",
        presentationFiles: "stub-presentationFiles",
        spreadsheetFiles: "stub-spreadsheetFiles",
        availableImageExtensions: "stub-availableImageExtensions",
        fileTypesQuestion: "stub-fileTypesQuestion",
      },
    },
  };

  const setup = () =>
    render(
      <TestBed stores={stubStore as TestBedStore}>
        <DocumentGuidance />
      </TestBed>,
    );

  beforeAll(async () => {
    await testInitialiseInternationalisation(stubContent);
  });

  describe("@renders", () => {
    describe("static content", () => {
      const excludedList = ["title", "fileSize"] as const;
      type ExcludedKeys = typeof excludedList[number];
      type StaticDocumentGuidanceKeys = Exclude<keyof typeof stubContent.components.documentGuidance, ExcludedKeys>;

      const documentGuidanceKeys = Object.keys(stubContent.components.documentGuidance).filter(
        x => !excludedList.some(el => el === x),
      ) as StaticDocumentGuidanceKeys[];

      test.each(documentGuidanceKeys)("with %s", contentKey => {
        const { queryByText } = setup();

        const targetText = stubContent.components.documentGuidance[contentKey];
        const contentTarget = queryByText(targetText);

        expect(contentTarget).toBeInTheDocument();
      });
    });

    describe("variable content", () => {
      test("fileSize", () => {
        const { queryByText } = setup();

        console.log(bytes(stubStore.config.getConfig().options.maxFileSize));

        const targetText = `stub-fileSize: 1KB`;
        const contentTarget = queryByText(targetText);

        expect(contentTarget).toBeInTheDocument();
      });
    });
  });
});
