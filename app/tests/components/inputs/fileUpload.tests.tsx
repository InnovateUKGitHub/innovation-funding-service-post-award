// tslint:disable:no-duplicate-string
import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { FileUpload } from "../../../src/ui/components/inputs/fileUpload";

Enzyme.configure({ adapter: new Adapter() });

describe("FileInput", () => {
  it("Renders with correct name", () => {
    const wrapper = mount(<FileUpload name="testName" value={null} onChange={(x) => x} />);
    expect(wrapper.childAt(0).prop("name")).toContain("testName");
  });

  it("Renders as enabled when the disabled flag is set to false", () => {
    const wrapper = mount(<FileUpload name="testName" value={null} onChange={(x) => x} disabled={false}/>);
    expect(wrapper.childAt(0).prop("disabled")).toBe(false);
  });

  it("Renders as disabled when the disabled flag is set to true", () => {
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
    expect(onChange).toHaveBeenCalledWith({ file: "TextFile.txt" });
  });

  it("Calls onChange on blur", () => {
    const onChange = jest.fn();
    const wrapper = mount(<FileUpload name="testName" value={null} onChange={onChange}/>);

    wrapper.simulate("blur");

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("doesn't use default value prop when a value is passed", () => {
    const wrapper = mount(<FileUpload name="test" value={"testfile" as any} onChange={jest.fn()} />);
    expect(wrapper.find("input").prop("value")).toBe(undefined);
  });

  it("Will unset selected file when props value changes to null", () => {
    const wrapper = mount(<FileUpload name="testName" value={"test" as any} onChange={jest.fn()}/>);
    wrapper.setProps({value: "string"});
    expect(wrapper.prop("value")).toBe("string");

    wrapper.setProps({value: null});
    expect(wrapper.find("input").prop("value")).toBe(undefined);
  });
});
