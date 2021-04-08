import * as ACC from "@ui/components";
import TestBed, { TestBedContent } from "@shared/TestBed";
import { render } from "@testing-library/react";
import { DocumentViewProps } from "@ui/components";

describe("<DocumentView />", () => {
  const stubContent = {
    components: {
      documentView: {
        fallbackValidationMessage: {
          content: "stub-fallback-validation-message",
        },
      },
    },
  };

  const setup = (props: DocumentViewProps) => {
    return render(
      <TestBed content={stubContent as TestBedContent}>
        <ACC.DocumentView {...props} />
      </TestBed>,
    );
  };

  describe("@renders", () => {
    test("with default validation message", () => {
      const props = {
        documents: [],
      } as DocumentViewProps;
      const wrapper = setup(props);

      expect(wrapper.getByText(stubContent.components.documentView.fallbackValidationMessage.content)).toBeInTheDocument();
    });

    test("with validationMessage", () => {
      const props = {
        documents: [],
        validationMessage: "stub-validation-message",
      } as DocumentViewProps;
      const wrapper = setup(props);

      expect(wrapper.getByText("stub-validation-message")).toBeInTheDocument();
    });

    test("with documents list", () => {
      const props = {
        documents: [
          { fileName: "first-document-file-name" },
        ],
      } as DocumentViewProps;
      const wrapper = setup(props);
      const tableEl = wrapper.queryByTestId("supporting-documents");

      expect(tableEl).toBeInTheDocument();
      expect(wrapper.queryByText(stubContent.components.documentView.fallbackValidationMessage.content)).not.toBeInTheDocument();
    });
  });
});
