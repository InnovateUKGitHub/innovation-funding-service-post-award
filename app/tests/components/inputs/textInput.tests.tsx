import React from "react";
// tslint:disable-next-line: import-blacklist
import { mount } from "enzyme";

import { TextInput, TextInputProps } from "../../../src/ui/components/inputs/textInput";

describe("TextInput", () => {
  const defaultProps = {
    name: "stub-name",
  };

  const setup = (props?: Partial<TextInputProps>) => mount(<TextInput {...defaultProps} {...props} />);

  it("Renders with correct class", () => {
    const wrapper = setup();
    expect(wrapper.childAt(0).prop("className")).toContain("govuk-input");
  });

  it("Renders with correct name", () => {
    const stubName = "has-valid-name";
    const wrapper = setup({ name: stubName });
    expect(wrapper.childAt(0).prop("name")).toContain(stubName);
  });

  describe("Renders with enabled", () => {
    it("when true false by default", () => {
      const wrapper = setup();
      expect(wrapper.childAt(0).prop("disabled")).toBe(false);
    });

    it("when false", () => {
      const wrapper = setup({ disabled: true });
      expect(wrapper.childAt(0).prop("disabled")).toBe(true);
    });
  });

  it("Renders with no text", () => {
    const wrapper = setup();
    expect(wrapper.childAt(0).prop("value")).toBe("");
  });

  it("Renders with correct text", () => {
    const wrapper = setup({ value: "test text" });
    expect(wrapper.childAt(0).prop("value")).toBe("test text");
  });

  it("Renders with correct maxLength attribute", () => {
    const wrapper = setup({ maxLength: 20 });
    expect(wrapper.find("input").prop("maxLength")).toEqual(20);
  });

  it("Renders placeholder", () => {
    const wrapper = setup({ placeholder: "randomText" });
    expect(wrapper.childAt(0).prop("placeholder")).toBe("randomText");
  });

  it("Should update state when props change", () => {
    const wrapper = setup({ maxLength: 20, value: "" });
    wrapper.setProps({ value: "test" });

    expect(wrapper.state("value")).toBe("test");
  });

  it("Should call onChange on key up", () => {
    const onChange = jest.fn();
    const wrapper = setup({ maxLength: 20, value: "", onChange });

    wrapper.setProps({ handleKeyTyped: true });

    (wrapper.find("input").instance() as any).value = "1";

    wrapper.simulate("keyup");

    expect(onChange).toHaveBeenCalledWith("1");
  });

  it("Should update state on blur", () => {
    const onChange = jest.fn();
    const wrapper = setup({ maxLength: 20, value: "", onChange });

    (wrapper.find("input").instance() as any).value = "1";
    wrapper.simulate("blur");

    expect(onChange).toHaveBeenCalledWith("1");
  });

  it("Debounces onChange calls", async done => {
    const onChange = jest.fn();
    const wrapper = setup({ onChange });

    (wrapper.find("input").instance() as any).value = "1";
    wrapper.simulate("change");

    (wrapper.find("input").instance() as any).value = "2";
    wrapper.simulate("change");

    (wrapper.find("input").instance() as any).value = "3";
    wrapper.simulate("change");

    await new Promise<void>(resolve => setTimeout(resolve, 500));

    expect(wrapper.state("value")).toBe("3");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("3");
    done();
  });
});
