import "jest";
import React from "react";
import Enzyme, { mount, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { NumberInput } from "../../../src/ui/components/inputs/numberInput";

Enzyme.configure({ adapter: new Adapter() });

describe("NumberInput", () => {
  it("Renders with given name", () => {
    const output = shallow(<NumberInput name="number test" />);
    expect(output.prop("name")).toBe("number test");
  });

  it("Renders with no value empty", () => {
    const output = shallow(<NumberInput name="number test" />);
    expect(output.prop("value")).toBe("");
  });

  it("Renders with given value", () => {
    const output = shallow(<NumberInput name="number test" value={78} />);
    expect(output.prop("value")).toBe("78");
  });

  it("Renders with basic classNames", () => {
    const output = shallow(<NumberInput name="number test" />);
    expect(output.prop("className")).toContain("govuk-input");
    expect(output.prop("className")).toContain("govuk-table__cell--numeric");
  });

  it("Renders with given className", () => {
    const output = shallow(<NumberInput name="number test" className="testing" />);
    expect(output.prop("className")).toContain("testing");
  });

  it("Renders with error class when invalid", () => {
    const output = shallow(<NumberInput name="number test" />);
    output.setState({ invalid: true });
    expect(output.prop("className")).toContain("govuk-input--error");
  });

  it("Renders enabled as default", () => {
    const output = shallow(<NumberInput name="number test" />);
    expect(output.prop("disabled")).toBe(false);
  });

  it("Renders as disabled", () => {
    const output = shallow(<NumberInput name="number test" disabled={true} />);
    expect(output.prop("disabled")).toBe(true);
  });

  it("Updates component state with value", () => {
    const output = mount(<NumberInput name="number test" />);

    expect(output.state("value")).toBe("");
    (output.find("input").instance() as any).value = "1";
    output.simulate("change");
    expect(output.state("value")).toBe("1");
  });

  it("Debounces onChange calls", async (done) => {
    const onChange = jest.fn();
    const output = mount(<NumberInput name="number test" onChange={onChange} />);

    (output.find("input").instance() as any).value = "1";
    output.simulate("change");
    (output.find("input").instance() as any).value = "2";
    output.simulate("change");
    (output.find("input").instance() as any).value = "3";
    output.simulate("change");

    await new Promise(resolve => setTimeout(() => resolve(), 500));

    expect(output.state("value")).toBe("3");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(3);
    done();
  });

  it("Doesn't call onChange when value unchanged", async (done) => {
    const onChange = jest.fn();
    const output = mount(<NumberInput name="number test" value={1} onChange={onChange} />);

    (output.find("input").instance() as any).value = "1";
    output.simulate("change");

    await new Promise(resolve => setTimeout(() => resolve(), 500));

    expect(output.state("value")).toBe("1");
    expect(onChange).not.toHaveBeenCalled();
    done();
  });

  it("Updates state on blur", () => {
    const output = mount(<NumberInput name="number test" />);

    (output.find("input").instance() as any).value = "1";
    expect(output.state("value")).toBe("");

    output.simulate("blur");
    expect(output.state("value")).toBe("1");
  });

  it("Calls onChange after onBlur event", async (done) => {
    const onChange = jest.fn();
    const output = mount(<NumberInput name="number test" onChange={onChange} />);

    (output.find("input").instance() as any).value = "2";
    output.simulate("blur");

    expect(output.state("value")).toBe("2");
    expect(onChange).toHaveBeenCalledTimes(1);
    done();
  });

  it("Calls onChange with null if value is empty string", async (done) => {
    const onChange = jest.fn();
    const output = mount(<NumberInput name="number test" value={1} onChange={onChange} />);

    (output.find("input").instance() as any).value = "";
    output.simulate("blur");

    expect(output.state("value")).toBe("");
    expect(onChange).toHaveBeenCalledWith(null);
    done();
  });

  it("Calls onChange with Nan if value is not a number", async (done) => {
    const onChange = jest.fn();
    const output = mount(<NumberInput name="number test" value={1} onChange={onChange} />);

    (output.find("input").instance() as any).value = "abc";
    output.simulate("blur");

    expect(output.state("value")).toBe("abc");
    expect(onChange).toHaveBeenCalledWith(NaN);
    done();
  });

  it("Props updates state value on change", () => {
    const output = mount(<NumberInput name="number test" value={1} />);
    expect(output.state("value")).toBe("1");
    output.setProps({ value: 2 });
    expect(output.state("value")).toBe("2");
    expect(output.state("invalid")).toBe(false);
  });

  it("Props update with non numerical value sets state invalid", () => {
    const output = mount(<NumberInput name="number test" value={3} />);
    expect(output.state("value")).toBe("3");
    output.setProps({ value: "abc3" });
    expect(output.state("value")).toBe("abc3");
    expect(output.state("invalid")).toBe(true);
  });

  it("Props update with non numerical value when already invalid does nothing", () => {
    const output = mount(<NumberInput name="number test" value={"abc1" as any} />);
    output.setProps({ value: "abc3" });
    expect(output.state("value")).toBe("abc1");
    expect(output.state("invalid")).toBe(true);
  });

  it("Handles floating point numbers", () => {
    const output = mount(<NumberInput name="number test" value={(2.2 - 1)} />);
    expect((output.find("input").instance() as any).value).toBe("1.2");

  });
});
