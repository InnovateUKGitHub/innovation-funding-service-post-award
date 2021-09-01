import bytes from "bytes";
import { render } from "@testing-library/react";
import { DocumentGuidanceContent } from "@content/components/documentGuidanceContent";
import { TestBed, TestBedContent, TestBedStore } from "@shared/TestBed";
import { DocumentGuidance } from "@ui/components";
import { ContentResult } from "@content/contentBase";

describe("<DocumentGuidance />", () => {
  const stubStore = {
    config: {
      getConfig: () => ({
        options: {
          maxFileSize: 1024,
        },
      }),
    },
  } as any;

  const stubContent = {
    components: {
      documentGuidance: {
        uploadGuidance: { content: "stub-uploadGuidance" },
        uniqueFilename: { content: "stub-uniqueFilename" },
        noFilesNumberLimit: { content: "stub-noFilesNumberLimit" },
        fileSize: (size: number): ContentResult => ({
          key: "test-key",
          content: `stub-fileSize: ${bytes(size)}`,
          markdown: false,
        }),
        fileTypesUpload: { content: "stub-fileTypesUpload" },
        pdfFiles: { content: "stub-pdfFiles" },
        textFiles: { content: "stub-textFiles" },
        presentationFiles: { content: "stub-presentationFiles" },
        spreadsheetFiles: { content: "stub-spreadsheetFiles" },
        availableImageExtensions: { content: "stub-availableImageExtensions" },
        fileTypesQuestion: { content: "stub-fileTypesQuestion" },
      } as DocumentGuidanceContent,
    },
  };

  const setup = () =>
    render(
      <TestBed content={stubContent as TestBedContent} stores={stubStore as TestBedStore}>
        <DocumentGuidance />
      </TestBed>,
    );

  describe("@renders", () => {
    describe("static content", () => {
      const excludedList = ["title", "fileSize"] as const;
      type ExcludedKeys = typeof excludedList[number];
      type StaticDocumkentGuidanceKeys = Exclude<keyof DocumentGuidanceContent, ExcludedKeys>;

      const documentGuidanceKeys = Object.keys(stubContent.components.documentGuidance).filter(
        x => !excludedList.some(el => el === x),
      ) as StaticDocumkentGuidanceKeys[];

      test.each(documentGuidanceKeys)("with %s", contentKey => {
        const { queryByText } = setup();

        const targetText = stubContent.components.documentGuidance[contentKey].content;
        const contentTarget = queryByText(targetText);

        expect(contentTarget).toBeInTheDocument();
      });
    });

    describe("variable content", () => {
      test("fileSize", () => {
        const { queryByText } = setup();

        const targetText = `stub-fileSize: ${bytes(stubStore.config.getConfig().options.maxFileSize)}`;
        const contentTarget = queryByText(targetText);

        expect(contentTarget).toBeInTheDocument();
      });
    });
  });
});
