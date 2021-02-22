import { render } from "@testing-library/react";
import { DocumentGuidanceContent } from "@content/components/documentGuidanceContent";
import { TestBed, TestBedContent } from "@shared/TestBed";
import { DocumentGuidance } from "@ui/components";

describe("<DocumentGuidance />", () => {
  const stubContent = {
    components: {
      documentGuidance: {
        uploadGuidance: { content: "stub-uploadGuidance" },
        fileSize: { content: "stub-fileSize" },
        uniqueFilename: { content: "stub-uniqueFilename" },
        noFilesNumberLimit: { content: "stub-noFilesNumberLimit" },
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
      <TestBed content={stubContent as TestBedContent}>
        <DocumentGuidance />
      </TestBed>,
    );

  describe("@renders", () => {
    type DocumentGuidanceKeys = Exclude<keyof DocumentGuidanceContent, "title">;

    const documentGuidanceKeys = Object.keys(stubContent.components.documentGuidance) as DocumentGuidanceKeys[];

    test.each(documentGuidanceKeys)("with %s", contentKey => {
      const { queryByText } = setup();

      const targetText = stubContent.components.documentGuidance[contentKey].content;
      const contentTarget = queryByText(targetText);

      expect(contentTarget).toBeInTheDocument();
    });
  });
});
