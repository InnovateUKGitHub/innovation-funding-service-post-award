import TestBed from "@shared/TestBed";
import { fireEvent, render } from "@testing-library/react";
import { noop } from "@ui/helpers/noop";

import { MultipleFileUpload, MultipleFileUploadProps } from "../../../src/ui/components/inputs/fileUpload";

describe("<MultipleFileUpload />", () => {
  const defaultProps: MultipleFileUploadProps = {
    name: "stub-name",
    value: null,
    onChange: noop,
  };
  const testQa = "multiple-file-upload";

  const setup = (props?: Partial<MultipleFileUploadProps>) => {
    return render(
      <TestBed>
        <MultipleFileUpload {...defaultProps} {...props} />
      </TestBed>,
    );
  };

  describe("@renders", () => {
    test("as enabled when disabled flag is false", () => {
      const { queryByTestId } = setup({ disabled: false });

      const targetElement = queryByTestId(testQa);
      expect(targetElement).not.toHaveAttribute("disabled");
    });

    test("as given qa", () => {
      const { queryByTestId } = setup({ qa: "stub-qa" });

      const targetElement = queryByTestId("stub-qa");
      expect(targetElement).toBeInTheDocument();
    });

    test("as disabled when disabled flag is true", () => {
      const { queryByTestId } = setup({ disabled: true });

      const targetElement = queryByTestId(testQa);
      expect(targetElement).toHaveAttribute("disabled");
    });

    test("with error", () => {
      const { queryByTestId } = setup({ error: true });

      const targetElement = queryByTestId(testQa);
      expect(targetElement).toHaveClass("govuk-file-upload--error");
    });

    test("with no error", () => {
      const { queryByTestId } = setup({ error: false });

      const targetElement = queryByTestId(testQa);
      expect(targetElement).not.toHaveClass("govuk-file-upload--error");
    });
  });

  describe("@events", () => {
    test("calls onChange when a file is selected", () => {
      const onChange = jest.fn();

      const { getByTestId } = setup({ onChange });

      expect(onChange).toHaveBeenCalledTimes(0);
      fireEvent.change(getByTestId(testQa), {
        target: {
          files: ["TextFile.txt"],
        },
      });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith([{ file: "TextFile.txt", fileName: undefined, size: undefined }]);
    });

    test("calls onChange on blur with file", () => {
      const onChange = jest.fn();
      const { getByTestId } = setup({ onChange });

      const targetElement = getByTestId(testQa);
      fireEvent.blur(targetElement, {
        target: {
          files: ["TextFile.txt"],
        },
      });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith([{ file: "TextFile.txt", fileName: undefined, size: undefined }]);
    });

    test("calls onChange on blur with empty files", () => {
      const onChange = jest.fn();
      const { getByTestId } = setup({ onChange });

      const targetElement = getByTestId(testQa);
      fireEvent.blur(targetElement, {
        target: {
          files: [],
        },
      });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith([]);
    });
  });
});
