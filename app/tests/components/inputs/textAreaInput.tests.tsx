import React from "react";
// tslint:disable-next-line: import-blacklist
import { mount } from "enzyme";

import { TextAreaInput } from "../../../src/ui/components/inputs/textAreaInput";

describe("TextAreaInput", () => {
  it("Renders with correct class", () => {
    const wrapper = mount(<TextAreaInput name="testName" />);
    expect(wrapper.childAt(0).prop("className")).toContain("govuk-textarea");
  });

  it("Renders with correct name", () => {
    const wrapper = mount(<TextAreaInput name="testName" />);
    expect(wrapper.childAt(0).prop("name")).toContain("testName");
  });

  it("Renders enabled by default", () => {
    const wrapper = mount(<TextAreaInput name="testName" />);
    expect(wrapper.childAt(0).prop("disabled")).toBe(false);
  });

  it("Renders as disabled", () => {
    const wrapper = mount(<TextAreaInput name="testName" disabled={true}/>);
    expect(wrapper.childAt(0).prop("disabled")).toBe(true);
  });

  it("Renders with no text", () => {
    const wrapper = mount(<TextAreaInput name="testName" />);
    expect(wrapper.find("textarea").text()).toBe("");
  });

  it("Renders with correct text", () => {
    const wrapper = mount(<TextAreaInput name="testName" value="Test value" />);
    expect(wrapper.find("textarea").text()).toBe("Test value");
  });

  it("Renders with correct qa", () => {
    const wrapper = mount(<TextAreaInput name="testName" qa="testQa"/>);
    expect(wrapper.find("textarea").prop("data-qa")).toEqual("testQa");
  });

  it("Renders with correct maxLength attribute", () => {
    const wrapper = mount(<TextAreaInput name="testName" maxLength={20} />);
    expect(wrapper.find("textarea").prop("maxLength")).toEqual(20);
  });

  it("Should update state when props change", () => {
    const wrapper = mount(<TextAreaInput name="testName" maxLength={20} value="" />);
    wrapper.setProps({value: "test"});

    expect(wrapper.state("value")).toBe("test");
  });

  it("Should update state on blur", () => {
    const onChange = jest.fn();
    const wrapper = mount(<TextAreaInput name="testName" maxLength={20} value="" onChange={onChange} />);

    (wrapper.find("textarea").instance() as any).value = "1";
    wrapper.simulate("blur");

    expect(onChange).toHaveBeenCalledWith("1");
  });

  it("Debounces onChange calls", async (done) => {
    const onChange = jest.fn();
    const wrapper = mount(<TextAreaInput name="testName" onChange={onChange} />);

    (wrapper.find("textarea").instance() as any).value = "1";
    wrapper.simulate("change");
    (wrapper.find("textarea").instance() as any).value = "2";
    wrapper.simulate("change");
    (wrapper.find("textarea").instance() as any).value = "3";
    wrapper.simulate("change");

    await new Promise<void>(resolve => setTimeout(resolve, 500));

    expect(wrapper.state("value")).toBe("3");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("3");
    done();
  });
});
