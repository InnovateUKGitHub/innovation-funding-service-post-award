// tslint:disable:no-duplicate-string
import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { FileUpload } from "../../../src/ui/components/inputs";

Enzyme.configure({ adapter: new Adapter() });

describe("NumberInput", () => {
  it("Renders with correct class", () => {
    const wrapper = mount(<FileUpload name="testName" value={null} onChange={(x) => console.log(x)} />);
    expect(wrapper.childAt(0).prop("className")).toContain("govuk-file-upload");
  });

  it("Renders with correct name", () => {
    const wrapper = mount(<FileUpload name="testName" value={null} onChange={(x) => x} />);
    expect(wrapper.childAt(0).prop("name")).toContain("testName");
  });

  it("Renders as enabled", () => {
    const wrapper = mount(<FileUpload name="testName" value={null} onChange={(x) => x} disabled={false}/>);
    expect(wrapper.childAt(0).prop("disabled")).toBe(false);
  });

  it("Renders as disabled", () => {
    const wrapper = mount(<FileUpload name="testName" value={null} onChange={(x) => x} disabled={true}/>);
    expect(wrapper.childAt(0).prop("disabled")).toBe(true);
  });

  it("Calls onChange when a file is selected", () => {
    const onChange = jest.fn();
    const wrapper = mount(<FileUpload name="testName" value={null} onChange={onChange}/>);

    wrapper.find("input").simulate("change", {
      target: {
        files: ["TextFile.txt"]
      }
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("TextFile.txt");
  });

  it("Calls onChange on blur", () => {
    const onChange = jest.fn();
    const wrapper = mount(<FileUpload name="testName" value={null} onChange={onChange}/>);

    wrapper.simulate("blur");

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("Will update file to '' if props are null", () => {
    const wrapper = mount(<FileUpload name="testName" value={null} onChange={(x) => x}/>);

    wrapper.setProps({files: null});

    expect(wrapper.prop("files")).toEqual("");
  });
});
