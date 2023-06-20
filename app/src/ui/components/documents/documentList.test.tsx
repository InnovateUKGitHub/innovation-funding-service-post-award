import { render } from "@testing-library/react";
import TestBed from "@shared/TestBed";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { DocumentSummaryDto } from "@framework/dtos/documentDto";
import { DocumentViewProps, DocumentView } from "./DocumentView";

describe("<DocumentView />", () => {
  const stubContent = {
    documentLabels: {
      documentDisplayTitle: "stub-documentDisplayTitle",
      documentDisplaySubTitle: "stub-documentDisplaySubTitle",
    },
    documentMessages: {
      noDocumentsUploaded: "stub-noDocumentsUploaded",
    },
  };

  const defaultProps: DocumentViewProps<DocumentSummaryDto> = {
    documents: [],
    qa: "stub-qa",
  };

  const setup = (props?: Partial<DocumentViewProps<DocumentSummaryDto>>) => {
    return render(
      <TestBed>
        <DocumentView {...defaultProps} {...props} />
      </TestBed>,
    );
  };

  beforeAll(async () => {
    await initStubTestIntl(stubContent);
  });

  describe("@renders", () => {
    test("with default validation message", () => {
      const wrapper = setup();

      const fallbackContent = stubContent.documentMessages.noDocumentsUploaded;

      expect(wrapper.getByText(fallbackContent)).toBeInTheDocument();
    });

    test("with validationMessage", () => {
      const stubValidationMessage = "stub-validation-message";

      const wrapper = setup({
        validationMessage: stubValidationMessage,
      });

      expect(wrapper.getByText(stubValidationMessage)).toBeInTheDocument();
    });

    test("with documents list", () => {
      const stubDocument: DocumentSummaryDto = {
        fileName: "stub-filename",
        link: "stub-link",
        id: "stub-id",
        fileSize: 1024,
        dateCreated: new Date(Date.UTC(2021, 10, 1)),
        uploadedBy: "stub-uploadedBy",
        isOwner: true,
      };

      const { queryByTestId, queryByText } = setup({ documents: [stubDocument], qa: "docs-list" });

      const fallbackContent = stubContent.documentMessages.noDocumentsUploaded;

      expect(queryByTestId("docs-list-container")).toBeInTheDocument();
      expect(queryByText(fallbackContent)).not.toBeInTheDocument();
    });
  });
});
