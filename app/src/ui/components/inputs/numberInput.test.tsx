import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { NumberInput } from "@ui/components/inputs/numberInput";

describe("NumberInput", () => {
  const getInput = (props?: any) => {
    const { getByLabelText } = render(
      <NumberInput name="testName" debounce={false} ariaLabel="test number input" {...props} />,
    );

    return getByLabelText("test number input") as HTMLInputElement;
  };

  it("Renders with given name", () => {
    render(<NumberInput name="testName" />);
    expect(document.querySelector('[name="testName"]')).toBeInTheDocument();
  });

  it("Renders with no value empty", () => {
    const input = getInput();
    expect(input.value).toBe("");
  });

  it("Renders with given value", () => {
    const input = getInput({ value: 78 });
    expect(input.value).toBe("78");
  });

  it("Renders with empty string if null value given", () => {
    const input = getInput({ value: null });
    expect(input.value).toBe("");
  });

  it("Renders with basic classNames", () => {
    const input = getInput({ value: 78 });
    expect(input).toHaveClass("govuk-input");
    expect(input).toHaveClass("govuk-table__cell--numeric");
  });

  it("Renders with given className", () => {
    const input = getInput({ value: 78, className: "testing" });
    expect(input).toHaveClass("testing");
  });

  it("Renders with error class when invalid", () => {
    const input = getInput({ value: 78 });
    expect(input).not.toHaveClass("govuk-input--error");
    userEvent.type(input, "ha");
    expect(input).toHaveClass("govuk-input--error");
  });

  it("Renders enabled as default", () => {
    const input = getInput();
    expect(input).not.toBeDisabled();
  });

  it("Renders as disabled", () => {
    const input = getInput({ disabled: true });
    expect(input).toBeDisabled();
  });

  it("Debounces onChange calls", () => {
    jest.useFakeTimers();
    const onChange = jest.fn();
    const input = getInput({ value: 12, onChange, debounce: true });

    userEvent.type(input, "1");
    userEvent.clear(input);
    userEvent.type(input, "2");
    userEvent.clear(input);
    userEvent.type(input, "3");
    jest.runAllTimers();
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith(3);
    jest.useRealTimers();
  });

  it("Updates component state with value", async () => {
    const input = getInput({ value: "" });
    userEvent.type(input, "1");
    expect(input.value).toBe("1");
  });

  it("Calls a passed in onchange when value changed", () => {
    const onChange = jest.fn();
    const input = getInput({ value: 1, onChange});
    userEvent.type(input, "2");
    expect(onChange).toHaveBeenCalledWith(12);
  });

  it("Calls onChange with null if value is empty string", () => {
    const onChange = jest.fn();
    const input = getInput({ value: 1, onChange});
    userEvent.clear(input);
    userEvent.type(input, "");
    expect(onChange).toHaveBeenCalledWith(null);

  });

  it("Calls onChange with Nan if value is not a number",  () => {
    const onChange = jest.fn();
    const input = getInput({ value: 1, onChange});
    userEvent.type(input, "abc");
    expect(onChange).toHaveBeenCalledWith(NaN);

  });

  it("Handles floating point numbers", () => {
    const input = getInput({ value: 2.2 - 1});
    expect(input.value).toBe("1.2");
  });
});