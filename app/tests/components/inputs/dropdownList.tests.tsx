// tslint:disable:no-duplicate-string no-identical-functions
import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { DropdownList } from "@ui/components/inputs";

Enzyme.configure({ adapter: new Adapter() });

const dropdownOptions = [
  { id: "1", value: "Value 1" },
  { id: "2", value: "Value 2" },
  { id: "3", value: "Value 3" },
];

describe("Dropdown list", () => {

  it("Renders select with given name", () => {
    const wrapper = mount(<DropdownList name="testName" options={dropdownOptions} />);
    expect(wrapper.find("select").length).toBe(1);
    const select = wrapper.find("select").first();
    expect(select.props().name).toBe("testName");
  });

  it("Renders with given options name and values", () => {
    const wrapper = mount(<DropdownList name="testName" options={dropdownOptions} />);
    expect(wrapper.find("option").length).toBe(3);
    const options = wrapper.find("option");
    expect(options.map(x => x.props().value)).toEqual(["1", "2", "3"]);
    expect(options.map(x => x.text())).toEqual(["Value 1", "Value 2", "Value 3"]);
  });

  it("Renders with empty options if specified", () => {
    const wrapper = mount(<DropdownList name="testName" hasEmptyOption={true} options={dropdownOptions} />);
    expect(wrapper.find("option").length).toBe(4);
    const emptyOption = wrapper.find("option").first();
    expect(emptyOption.props().value).toBe("");
    expect(emptyOption.text()).toEqual("");
  });

  it("Specifies empty option as selected if nothing selected", () => {
    const wrapper = mount(<DropdownList name="testName" hasEmptyOption={true} options={dropdownOptions} />);

    expect(wrapper.find("select").first().props().value).toBe("");
    expect(wrapper.find("option").first().getDOMNode().getAttribute("aria-selected")).toBe("true");
  });

  it("Specifies nothing as selected if nothing selected and no empty option", () => {
    const wrapper = mount(<DropdownList name="testName" options={dropdownOptions} />);

    expect(wrapper.find("select").first().props().value).toBe("");
    expect(wrapper.find("option").map(x => x.getDOMNode().getAttribute("aria-selected"))).toEqual(["false", "false", "false"]);
  });

  it("Specifies selected option", () => {
    const wrapper = mount(<DropdownList name="testName" options={dropdownOptions} value={dropdownOptions[1]} />);

    expect(wrapper.find("select").first().props().value).toEqual("2");
    expect(wrapper.find("option").map(x => x.getDOMNode().getAttribute("aria-selected"))).toEqual(["false", "true", "false"]);
  });

  it("Fires change if value changed", () => {
    const onChange = jest.fn();

    const wrapper = mount(<DropdownList name="testName" options={dropdownOptions} onChange={onChange} />);

    const select = wrapper.find("select").first();
    select.simulate("change", { target: { value: "2" } });

    expect(onChange).toBeCalledWith({ id: "2", value: "Value 2" });
  });

  it("Fires change if value cleared", () => {
    const onChange = jest.fn();

    const wrapper = mount(<DropdownList name="testName" hasEmptyOption={true} options={dropdownOptions} onChange={onChange} value={dropdownOptions[1]} />);

    const select = wrapper.find("select").first();
    select.simulate("change", { target: { value: "" } });

    expect(onChange).toBeCalledWith(null);
  });

});
