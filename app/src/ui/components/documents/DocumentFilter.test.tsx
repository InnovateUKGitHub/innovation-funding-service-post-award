import { render, fireEvent, act } from "@testing-library/react";

import { TestBed, TestBedContent } from "@shared/TestBed";
import { DocumentFilter, DocumentFilterProps } from "@ui/components/documents/DocumentFilter";

describe("<DocumentFilter />", () => {
  const stubContent = {
    components: {
      documents: {
        messages: {
          noDocumentsUploaded: {
            content: "stub-noDocumentsUploaded",
          },
        },
      },
    },
  };

  const defaultProps: DocumentFilterProps = {
    value: "stub-value",
    qa: "stub-qa",
    onSearch: jest.fn(),
  };

  const setup = (props?: Partial<DocumentFilterProps>) => {
    const rtl = render(
      <TestBed content={stubContent as TestBedContent}>
        <DocumentFilter {...defaultProps} {...props} />
      </TestBed>,
    );

    const getInputElement = () => rtl.getByPlaceholderText("Search documents");

    const changeInputValue = (value: string) => {
      const inputElement = getInputElement();

      fireEvent.change(inputElement, { target: { value } });

      // Note: Trick input base debounce
      jest.advanceTimersByTime(250);
    };

    return {
      ...rtl,
      getInputElement,
      changeInputValue,
    };
  };

  beforeEach(jest.clearAllMocks);

  describe("@returns", () => {
    test("with search field", () => {
      const { queryByPlaceholderText } = setup();

      expect(queryByPlaceholderText("Search documents")).toBeInTheDocument();
    });

    test("with name", () => {
      const stubName = "stub-name";
      const { container } = setup({ name: stubName });

      const targetElement = container.querySelector(`[name="${stubName}"]`);

      expect(targetElement).toBeInTheDocument();
    });

    test("with value", () => {
      const stubValue = "stub-value";
      const { getInputElement } = setup({ value: stubValue });

      const targetElement = getInputElement();

      expect(targetElement).toHaveAttribute("value", stubValue);
    });

    test("with qa", () => {
      const stubQa = "stub-qa";
      const { queryByTestId } = setup({ qa: stubQa });

      expect(queryByTestId(stubQa)).toBeInTheDocument();
    });
  });

  describe("@events", () => {
    describe("with onSearch", () => {
      test("does not get called on load", () => {
        const stubOnSeach = jest.fn();

        setup({ onSearch: stubOnSeach });

        expect(stubOnSeach).toHaveBeenCalledTimes(0);
      });

      test("with input change calls when a value is changed", () => {
        const stubSearchValue = "stub-search-value";

        jest.useFakeTimers();
        const stubOnSeach = jest.fn();

        const { changeInputValue } = setup({ onSearch: stubOnSeach });

        act(() => {
          changeInputValue(stubSearchValue);
        });

        expect(stubOnSeach).toHaveBeenCalledTimes(1);
        expect(stubOnSeach).toHaveBeenCalledWith(stubSearchValue);
      });
    });
  });
});
