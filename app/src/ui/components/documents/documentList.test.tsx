import { render } from "@testing-library/react";

import { DocumentSummaryDto } from "@framework/dtos";
import * as ACC from "@ui/components";
import TestBed, { TestBedContent } from "@shared/TestBed";
import { DocumentViewProps } from "@ui/components";

describe("<DocumentView />", () => {
  const stubContent = {
    components: {
      documents: {
        labels: {
          documentDisplayTitle: { content: "stub-documentDisplayTitle" },
          documentDisplaySubTitle: { content: "stub-documentDisplaySubTitle" },
        },
        messages: {
          noDocumentsUploaded: { content: "stub-noDocumentsUploaded" },
        },
      },
    },
  };

  const defaultProps: DocumentViewProps<DocumentSummaryDto> = {
    documents: [],
    qa: "stub-qa",
  };

  const setup = (props?: Partial<DocumentViewProps<DocumentSummaryDto>>) => {
    return render(
      <TestBed content={stubContent as TestBedContent}>
        <ACC.DocumentView {...defaultProps} {...props} />
      </TestBed>,
    );
  };

  describe("@renders", () => {
    test("with default validation message", () => {
      const wrapper = setup();

      const fallbackContent = stubContent.components.documents.messages.noDocumentsUploaded.content;

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
        uploadedByPartnerName: "stub-uploadedByPartnerName",
        isOwner: true,
      };

      const { queryByTestId, queryByText } = setup({ documents: [stubDocument], qa: "docs-list" });

      const fallbackContent = stubContent.components.documents.messages.noDocumentsUploaded.content;

      expect(queryByTestId("docs-list-container")).toBeInTheDocument();
      expect(queryByText(fallbackContent)).not.toBeInTheDocument();
    });
  });
});
