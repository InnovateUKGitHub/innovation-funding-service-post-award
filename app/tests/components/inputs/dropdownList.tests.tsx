import { fireEvent, render } from "@testing-library/react";

import TestBed from "@shared/TestBed";
import { DropdownList, DropdownListProps } from "@ui/components/inputs";

const stubOptions = [
  { id: "0", value: "stub value 1", qa: "stub-option-0-qa" },
  { id: "1", value: "stub value 2", qa: "stub-option-1-qa" },
  { id: "2", value: "stub value 3", qa: "stub-option-2-qa" },
];

describe("<DropdownList />", () => {
  const defaultProps: DropdownListProps = {
    options: [{ id: "0", value: "stub value 1", qa: "stub-option-1-qa" }],
    name: "stub-name",
  };

  const setup = (props?: DropdownListProps) =>
    render(
      <TestBed>
        <DropdownList {...defaultProps} {...props} />
      </TestBed>,
    );

  describe("@renders", () => {
    test("with qa", () => {
      const expectedQa = "expected-qa";
      const { queryByTestId } = setup({ qa: expectedQa } as DropdownListProps);

      const targetElement = queryByTestId(expectedQa);
      expect(targetElement).toBeInTheDocument();
    });

    test("with name", () => {
      const stubQa = "stub-qa";
      const expectedName = "expected-name";
      const { getByTestId } = setup({ qa: stubQa, name: expectedName } as DropdownListProps);

      const targetElement = getByTestId(stubQa);
      if (!targetElement) throw Error(`${stubQa} was not found on any element`);
      expect(targetElement.getAttribute("name")).toBe(expectedName);
    });

    test("with given options and values", () => {
      const { queryByTestId } = setup({
        options: stubOptions,
      } as DropdownListProps);

      for (let i = 0; i < 3; i++) {
        const targetElement = queryByTestId(`stub-option-${i}-qa`);

        expect(targetElement).toHaveValue(stubOptions[i].id);
        expect(targetElement).toHaveTextContent(stubOptions[i].value.toString());
        expect(targetElement).toBeInTheDocument();
      }
    });

    test("with empty options", () => {
      const { queryByTestId } = setup({ hasEmptyOption: true } as DropdownListProps);

      const targetElement = queryByTestId("placeholder-option");
      expect(targetElement).toBeInTheDocument();
      expect(targetElement).toHaveValue("");
      expect(targetElement).toHaveTextContent("");
    });

    test("with specified selected option", () => {
      const stubOptionsSelected = [
        { id: "0", value: "stub value 1", qa: "stub-selected-item" },
        { id: "1", value: "stub value 2", qa: "stub-option-1-qa" },
        { id: "2", value: "stub value 3", qa: "stub-option-2-qa" },
      ];

      const { queryByTestId } = setup({
        options: stubOptionsSelected,
        value: stubOptionsSelected[0],
      } as DropdownListProps);

      const selectedOption = queryByTestId("stub-selected-item");
      expect(selectedOption).toHaveAttribute("aria-selected", "true");

      for (let i = 1; i < 3; i++) {
        const nonSelectedOption = queryByTestId(`stub-option-${i}-qa`);
        expect(nonSelectedOption).toHaveAttribute("aria-selected", "false");
      }
    });

    describe("when nothing selected", () => {
      test("when empty option available, set as selected", () => {
        const { queryByTestId } = setup({ hasEmptyOption: true } as DropdownListProps);

        const targetElement = queryByTestId("placeholder-option");
        expect(targetElement).toHaveAttribute("aria-selected", "true");
      });

      test("when empty otpion available, nothing is selected", () => {
        const { queryByTestId } = setup({ options: stubOptions } as DropdownListProps);

        for (let i = 0; i < 3; i++) {
          const targetElement = queryByTestId(`stub-option-${i}-qa`);

          expect(targetElement).toHaveAttribute("aria-selected", "false");
        }
      });
    });
  });

  describe("@events", () => {
    test("fires change if value changed", () => {
      const onChange = jest.fn();
      const stubQa = "stub-qa";
      const options = [
        { id: "0", value: "stub value 1", qa: "stub-option-0-qa" },
        { id: "1", value: "stub value 2", qa: "stub-option-1-qa" },
        { id: "2", value: "stub value 3", qa: "stub-option-2-qa" },
      ];

      const { getByTestId } = setup({ qa: stubQa, options, onChange } as any);

      expect(onChange).toHaveBeenCalledTimes(0);
      fireEvent.change(getByTestId("stub-qa"), { target: { value: "1" } });
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith(options[1]);
    });

    test("fires change if value cleared", () => {
      const onChange = jest.fn();
      const stubQa = "stub-qa";
      const { getByTestId } = setup({
        qa: stubQa,
        hasEmptyOption: true,
        value: defaultProps.options[0],
        onChange,
      } as any);

      fireEvent.change(getByTestId("stub-qa"), { target: { value: "" } });
      expect(onChange).toHaveBeenCalledWith(null);
    });
  });
});
