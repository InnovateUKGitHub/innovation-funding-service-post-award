// tslint:disable:no-duplicate-string
import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { TextInput } from "../../../src/ui/components/inputs/textInput";

Enzyme.configure({ adapter: new Adapter() });

describe("TextInput", () => {
  it("Renders with correct class", () => {
    const wrapper = mount(<TextInput name="testName" />);
    expect(wrapper.childAt(0).prop("className")).toContain("govuk-input");
  });

  it("Renders with correct name", () => {
    const wrapper = mount(<TextInput name="testName" />);
    expect(wrapper.childAt(0).prop("name")).toContain("testName");
  });

  it("Renders enabled by default", () => {
    const wrapper = mount(<TextInput name="testName" />);
    expect(wrapper.childAt(0).prop("disabled")).toBe(false);
  });

  it("Renders as disabled", () => {
    const wrapper = mount(<TextInput name="testName" disabled={true} />);
    expect(wrapper.childAt(0).prop("disabled")).toBe(true);
  });

  it("Renders with no text", () => {
    const wrapper = mount(<TextInput name="testName" />);
    expect(wrapper.childAt(0).prop("value")).toBe("");
  });

  it("Renders with correct text", () => {
    const wrapper = mount(<TextInput name="testName" value="test text"/>);
    expect(wrapper.childAt(0).prop("value")).toBe("test text");
  });

  it("Renders with correct maxLength attribute", () => {
    const wrapper = mount(<TextInput name="testName" maxLength={20} />);
    expect(wrapper.find("input").prop("maxLength")).toEqual(20);
  });

  it("Renders placeholder", () => {
    const wrapper = mount(<TextInput name="testName" placeholder="randomText"/>);
    expect(wrapper.childAt(0).prop("placeholder")).toBe("randomText");
  });

  it("Should update state when props change", () => {
    const wrapper = mount(<TextInput name="testName" maxLength={20} value="" />);
    wrapper.setProps({value: "test"});

    expect(wrapper.state("value")).toBe("test");
  });

  it("Should call onChange on key up", () => {
    const onChange = jest.fn();
    const wrapper = mount(<TextInput name="testName" maxLength={20} value="" onChange={onChange} />);

    wrapper.setProps({handleKeyTyped: true});
    (wrapper.find("input").instance() as any).value = "1";
    wrapper.simulate("keyup");

    expect(onChange).toHaveBeenCalledWith("1");
  });

  it("Should update state on blur", () => {
    const onChange = jest.fn();
    const wrapper = mount(<TextInput name="testName" maxLength={20} value="" onChange={onChange} />);

    (wrapper.find("input").instance() as any).value = "1";
    wrapper.simulate("blur");

    expect(onChange).toHaveBeenCalledWith("1");
  });

  it("Debounces onChange calls", async (done) => {
    const onChange = jest.fn();
    const wrapper = mount(<TextInput name="testName" onChange={onChange} />);

    (wrapper.find("input").instance() as any).value = "1";
    wrapper.simulate("change");
    (wrapper.find("input").instance() as any).value = "2";
    wrapper.simulate("change");
    (wrapper.find("input").instance() as any).value = "3";
    wrapper.simulate("change");

    await new Promise(resolve => setTimeout(() => resolve(), 500));

    expect(wrapper.state("value")).toBe("3");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("3");
    done();
  });
});
