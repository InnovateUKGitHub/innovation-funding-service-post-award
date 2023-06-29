import { render, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TextInput, TextInputProps } from "@ui/components/bjss/inputs/textInput";

describe("TextInput", () => {
  const defaultProps = {
    name: "stub-name",
    debounce: false,
  };

  const setup = (props?: Partial<TextInputProps>) => render(<TextInput {...defaultProps} {...props} />);

  it("Renders with correct class", () => {
    const { container } = setup();
    expect(container.firstChild).toHaveClass("govuk-input");
  });

  it("Renders with correct name", () => {
    const stubName = "has-valid-name";
    const { container } = setup({ name: stubName });
    expect(container.firstChild).toHaveAttribute("name", stubName);
  });

  describe("Renders with enabled", () => {
    it("when true false by default", () => {
      const { container } = setup();
      expect(container.firstChild).not.toBeDisabled();
    });

    it("when false", () => {
      const { container } = setup({ disabled: true });
      expect(container.firstChild).toBeDisabled();
    });
  });

  it("Renders with no text", () => {
    const { container } = setup();
    expect((container.firstChild as HTMLInputElement).value).toBe("");
  });

  it("Renders with correct text", () => {
    const { container } = setup({ value: "test text" });
    expect((container.firstChild as HTMLInputElement).value).toBe("test text");
  });

  it("Renders with correct maxLength attribute", () => {
    const { container } = setup({ maxLength: 20 });
    expect(container.firstChild).toHaveAttribute("maxLength", "20");
  });

  it("Renders placeholder", () => {
    const { container } = setup({ placeholder: "randomText" });
    expect(container.firstChild).toHaveAttribute("placeholder", "randomText");
  });

  it("Should call onChange on key up", async () => {
    const onChange = jest.fn();
    const { container } = setup({ maxLength: 20, value: "", onChange, handleKeyTyped: true });
    await act(async () => {
      await userEvent.type(container.firstChild as HTMLInputElement, "1");
      await fireEvent.keyUp(container.firstChild as HTMLInputElement, { key: "1", code: "Digit1", keyCode: 49 });
    });
    expect(onChange).toHaveBeenCalledWith("1");
  });

  it("Should update state on blur", async () => {
    const onChange = jest.fn();
    const { container } = setup({ maxLength: 20, value: "", onChange });

    await act(async () => {
      await userEvent.type(container.firstChild as HTMLInputElement, "1");
      await fireEvent.blur(container.firstChild as HTMLInputElement);
    });

    expect(onChange).toHaveBeenCalledWith("1");
  });
});
