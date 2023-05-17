import { render } from "@testing-library/react";

import { TestBed } from "@shared/TestBed";
import { DocumentsUnavailable, DocumentsUnavailableProps } from "@ui/components/documents/DocumentsUnavailable";
import { initStubTestIntl } from "@shared/initStubTestIntl";

describe("<DocumentsUnavailable />", () => {
  const stubContent = {
    documentMessages: {
      noDocumentsUploaded: "stub-noDocumentsUploaded",
    },
  };

  const setup = (props?: Partial<DocumentsUnavailableProps>) =>
    render(
      <TestBed>
        <DocumentsUnavailable {...props} />
      </TestBed>,
    );

  beforeAll(async () => {
    initStubTestIntl(stubContent);
  });

  describe("@renders", () => {
    test("as default", () => {
      const { queryByText } = setup();

      const fallbackContent = stubContent.documentMessages.noDocumentsUploaded;

      expect(queryByText(fallbackContent)).toBeInTheDocument();
    });

    test("with validationMessage", () => {
      const stubMessage = "stub-validation-message";
      const { queryByText } = setup({ validationMessage: stubMessage });

      expect(queryByText(stubMessage)).toBeInTheDocument();
    });

    describe("with removeSpacing", () => {
      test("with removeSpacing", () => {
        const { container } = setup({ removeSpacing: true });

        const targetElement = container.querySelector(".govuk-\\!-margin-0");

        expect(targetElement).toBeInTheDocument();
      });

      test("without removeSpacing", () => {
        const { container } = setup({ removeSpacing: false });

        const targetElement = container.querySelector(".govuk-\\!-margin-top-5");

        expect(targetElement).toBeInTheDocument();
      });
    });
  });
});
