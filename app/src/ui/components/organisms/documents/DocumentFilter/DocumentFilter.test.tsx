import { render, fireEvent, act } from "@testing-library/react";

import { TestBed } from "@shared/TestBed";
import { DocumentFilter, DocumentFilterProps } from "@ui/components/organisms/documents/DocumentFilter/DocumentFilter";
import { initStubTestIntl } from "@shared/initStubTestIntl";

describe("<DocumentFilter />", () => {
  const stubContent = {
    documentMessages: {
      noDocumentsUploaded: "stub-noDocumentsUploaded",
    },
  };

  const defaultProps: DocumentFilterProps = {
    value: "stub-value",
    qa: "stub-qa",
    onSearch: jest.fn(),
  };

  const setup = (props?: Partial<DocumentFilterProps>) => {
    const rtl = render(
      <TestBed>
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

  beforeAll(async () => {
    initStubTestIntl(stubContent);
  });

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
        const stubOnSearch = jest.fn();

        setup({ onSearch: stubOnSearch });

        expect(stubOnSearch).toHaveBeenCalledTimes(0);
      });

      test("with input change calls when a value is changed", () => {
        const stubSearchValue = "stub-search-value";

        jest.useFakeTimers();
        const stubOnSearch = jest.fn();

        const { changeInputValue } = setup({ onSearch: stubOnSearch });

        act(() => {
          changeInputValue(stubSearchValue);
        });

        expect(stubOnSearch).toHaveBeenCalledTimes(1);
        expect(stubOnSearch).toHaveBeenCalledWith(stubSearchValue);
      });
    });
  });
});
