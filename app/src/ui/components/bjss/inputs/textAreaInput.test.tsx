import { render, fireEvent } from "@testing-library/react";

import { TextAreaInput, TextAreaInputProps } from "@ui/components/bjss/inputs/textAreaInput";
import { defaultInputDebounceTimeout } from "@ui/components/bjss/inputs/input-utils";

describe("TextAreaInput", () => {
  const defaultProps: TextAreaInputProps = {
    name: "stub-name",
    qa: "test-text-area-input",
  };

  const setup = (props?: Partial<TextAreaInputProps>) => {
    const rtl = render(<TextAreaInput {...defaultProps} {...props} />);

    const textarea = rtl.container.querySelector("textarea");
    if (!textarea) throw Error("No textarea was found");

    return { ...rtl, textarea };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  describe("@renders", () => {
    test("with correct class", () => {
      const { textarea } = setup();

      expect(textarea).toHaveClass("govuk-textarea");
    });

    test("with correct name", () => {
      const stubName = "stub-name";

      const { textarea } = setup({ name: stubName });

      expect(textarea).toHaveAttribute("name", stubName);
    });

    test("with enabled by default", () => {
      const { textarea } = setup();

      expect(textarea).not.toBeDisabled();
    });

    test("with as disabled", () => {
      const { textarea } = setup({ disabled: true });

      expect(textarea).toBeDisabled();
    });

    test("with no initial text", () => {
      const { textarea } = setup();

      expect(textarea).toHaveValue("");
    });

    test("with correct text", () => {
      const stubValue = "stub-value";

      const { getByText } = setup({ value: stubValue });
      const expectedElementWithText = getByText(stubValue);

      expect(expectedElementWithText).toBeInTheDocument();
    });

    test("with correct qa", () => {
      const stubQaValue = "stub-qa";

      const { getByTestId } = setup({ qa: stubQaValue });
      const expectedQaElement = getByTestId(stubQaValue);

      expect(expectedQaElement).toBeInTheDocument();
    });

    test("with correct maxLength attribute", () => {
      const stubMaxLength = 20;

      const { textarea } = setup({ maxLength: stubMaxLength });

      expect(textarea).toHaveAttribute("maxLength", `${stubMaxLength}`);
    });
  });

  describe("@events", () => {
    test("calls on blur", () => {
      const stubOnChange = jest.fn();

      const { textarea } = setup({ onChange: stubOnChange });

      // Note: Ensure no calls are make without changes
      expect(stubOnChange).toHaveBeenCalledTimes(0);

      fireEvent.blur(textarea);

      // Note: Trick input base debounce
      jest.advanceTimersByTime(defaultInputDebounceTimeout);

      expect(stubOnChange).toHaveBeenCalledTimes(1);
    });

    test("calls on change", () => {
      const stubChangedValue = "changed-value";
      const stubOnChange = jest.fn();

      const { textarea } = setup({ onChange: stubOnChange });

      // Note: Ensure no calls are make without changes
      expect(stubOnChange).toHaveBeenCalledTimes(0);

      fireEvent.change(textarea, { target: { value: stubChangedValue } });

      // Note: Trick input base debounce
      jest.advanceTimersByTime(defaultInputDebounceTimeout);

      expect(stubOnChange).toHaveBeenCalledTimes(1);
      expect(stubOnChange).toHaveBeenCalledWith(stubChangedValue);
    });

    test("debounces correctly calls", () => {
      // Note: This quick input value advances the time below threshold
      const quickInputInMs: number = defaultInputDebounceTimeout * 0.25;
      const stubOnChange = jest.fn();

      const { textarea } = setup({ onChange: stubOnChange });

      // Note: Ensure no calls are make without changes
      expect(stubOnChange).toHaveBeenCalledTimes(0);

      fireEvent.change(textarea, { target: { value: "first-change" } });
      jest.advanceTimersByTime(quickInputInMs);

      fireEvent.change(textarea, { target: { value: "second-change" } });
      jest.advanceTimersByTime(quickInputInMs);

      fireEvent.change(textarea, { target: { value: "third-change" } });

      jest.advanceTimersByTime(defaultInputDebounceTimeout);

      // Note: Since we only elapse the initial timeout one! We only expect one onChange() to be fired!
      expect(stubOnChange).toHaveBeenCalledTimes(1);
      expect(textarea).toHaveValue("third-change");
    });
  });
});
