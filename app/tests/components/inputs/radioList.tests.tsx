// tslint:disable:no-duplicate-string
import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { RadioList} from "../../../src/ui/components/inputs/radioList";
import { range } from "../../../src/shared/range";

Enzyme.configure({ adapter: new Adapter() });

const options = range(4).map(i => ({ value: `Option ${i}`, id: `${i}` }));

describe("RadioList", () => {
  it("Renders with correct class", () => {
    const wrapper = mount(<RadioList options={options} name="testName" inline={true} />);
    expect(wrapper.childAt(0).prop("className")).toContain("govuk-radios govuk-radios--inline");
  });

  it("renders with no selected button", () => {
    const wrapper = mount(<RadioList options={options} name="testName" inline={true}/>);
    const inputs = wrapper.find("input");

    inputs.forEach((x) => expect(x.prop("checked")).toBe(false));
  });

  it("marks the correct button as checked when set initially", () => {
    const wrapper = mount(<RadioList options={options} name="testName" value={{value: "Option 2", id: "2"}} inline={true}/>);
    const inputs = wrapper.find("input");

    expect(inputs.at(1).prop("checked")).toBe(true);
  });

  it("marks the correct button as checked when clicked", () => {
    const onChange = jest.fn();
    const wrapper = mount(<RadioList options={options} name="testName" onChange={onChange} inline={true}/>);
    const inputs = wrapper.find("input");
    inputs.at(2).simulate("change");

    expect(onChange).toHaveBeenCalledWith({value: "Option 3", id: "3"});
  });
});
