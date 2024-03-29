import { act, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { NumberInput, NumberInputProps } from "@ui/components/bjss/inputs/numberInput";

describe("NumberInput", () => {
  const getInput = (props?: Partial<NumberInputProps>) => {
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

  it("Renders with error class when invalid", async () => {
    const input = getInput({ value: 78 });
    expect(input).not.toHaveClass("govuk-input--error");
    await act(async () => {
      await userEvent.type(input, "ha");
    });
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

  it("Debounces onChange calls", async () => {
    jest.useFakeTimers({ legacyFakeTimers: true });
    const user = userEvent.setup({ delay: null });
    const onChange = jest.fn();
    const input = getInput({ value: 12, onChange, debounce: true });

    await act(async () => {
      await user.type(input, "1");
      await user.clear(input);
      await user.type(input, "2");
      await user.type(input, "3");
    });

    jest.runAllTimers();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(23);
    jest.useRealTimers();
  });

  it("Updates component state with value", async () => {
    const input = getInput({ value: null });
    await act(async () => {
      await userEvent.type(input, "1");
    });
    expect(input.value).toBe("1");
  });

  it("Calls a passed in onchange when value changed", async () => {
    const onChange = jest.fn();
    const input = getInput({ value: 1, onChange });
    await act(async () => {
      await userEvent.type(input, "2");
    });
    expect(onChange).toHaveBeenCalledWith(12);
  });

  it("Calls onChange with null if value is empty string", async () => {
    const onChange = jest.fn();
    const input = getInput({ value: 1, onChange });
    await act(async () => {
      await userEvent.clear(input);
      await userEvent.type(input, "{backspace}");
    });
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("Calls onChange with Nan if value is not a number", async () => {
    const onChange = jest.fn();
    const input = getInput({ value: 1, onChange });
    await act(async () => {
      await userEvent.type(input, "abc");
    });
    expect(onChange).toHaveBeenCalledWith(NaN);
  });

  it("Handles floating point numbers", () => {
    const input = getInput({ value: 2.2 - 1 });
    expect(input.value).toBe("1.2");
  });
});
