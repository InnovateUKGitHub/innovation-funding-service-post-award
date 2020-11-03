// tslint:disable:no-duplicate-string no-identical-functions
import React from "react";
import { mount } from "enzyme";

import { FullDateInput, MonthYearInput } from "@ui/components/inputs/dateInput";

describe("FullDateInput", () => {
  it("Renders with given name", () => {
    const wrapper = mount(<FullDateInput name="testName" />);
    expect(wrapper.prop("name")).toBe("testName");
  });

  it("Update component day state with value", () => {
    const wrapper = mount(<FullDateInput name="testName" />);

    expect(wrapper.state("day")).toBe("");

    const input = wrapper.find("input").first();
    (input.instance() as any).value = "25";
    input.simulate("change");
    expect(wrapper.state("day")).toEqual("25");
  });

  it("Update component month state with value", () => {
    const wrapper = mount(<FullDateInput name="testName" />);

    expect(wrapper.state("month")).toBe("");

    const input = wrapper.find("input").at(1);
    (input.instance() as any).value = "05";
    input.simulate("change");
    expect(wrapper.state("month")).toEqual("05");
  });

  it("Update component year state with value", () => {
    const wrapper = mount(<FullDateInput name="testName" />);

    expect(wrapper.state("year")).toBe("");

    const input = wrapper.find("input").last();
    (input.instance() as any).value = "2018";
    input.simulate("change");
    expect(wrapper.state("year")).toEqual("2018");
  });

  it("Invalid date causes onchange with NaN date", () => {
    let lastUpdate: Date|null = null;

    const wrapper = mount(<FullDateInput name="testName" onChange={jest.fn(v => lastUpdate = v)} debounce={false} />);
    wrapper.setState({
      day: "wrong",
      month: "invalid",
      year: "date",
    });

    const yearInput = wrapper.find("input").last();

    yearInput.simulate("change");

    expect(lastUpdate).not.toBeNull();
    expect(lastUpdate!.getTime()).toBeNaN();
  });
});

describe("MonthYearInput", () => {
  it("Renders with given name", () => {
    const wrapper = mount(<MonthYearInput name="testName" startOrEnd="start" />);
    expect(wrapper.prop("name")).toBe("testName");
  });

  it("Update component month state with value", () => {
    const wrapper = mount(<MonthYearInput name="testName" startOrEnd="start" />);

    expect(wrapper.state("month")).toBe("");

    const input = wrapper.find("input").first();
    (input.instance() as any).value = "05";
    input.simulate("change");
    expect(wrapper.state("month")).toEqual("05");
  });

  it("Update component year state with value", () => {
    const wrapper = mount(<MonthYearInput name="testName" startOrEnd="start" />);

    expect(wrapper.state("year")).toBe("");

    const input = wrapper.find("input").last();
    (input.instance() as any).value = "2018";
    input.simulate("change");
    expect(wrapper.state("year")).toEqual("2018");
  });

  it("Update component state with invalid values", () => {
    const wrapper = mount(<MonthYearInput name="testName" startOrEnd="start" />);

    const monthInput = wrapper.find("input").first();
    const yearInput = wrapper.find("input").last();
    (monthInput.instance() as any).value = "invalid";
    monthInput.simulate("change");
    (yearInput.instance() as any).value = "not OK";
    yearInput.simulate("change");

    expect(wrapper.state("month")).toEqual("invalid");
    expect(wrapper.state("year")).toEqual("not OK");
  });

  it("Sets the date to the first day of the month", () => {
    let lastUpdate: Date|null = null;

    const wrapper = mount(<MonthYearInput name="testName" startOrEnd="start" onChange={jest.fn(x => lastUpdate = x)} debounce={false}/>);

    wrapper.setState({
      month : "11",
      year: "2019"
    });

    wrapper.find("input").first().simulate("change");

    expect(lastUpdate).toEqual(new Date("2019-11-01T12:00:00"));
  });

  it("Sets the date to the last day of the month", () => {
    let lastUpdate: Date|null = null;

    const wrapper = mount(<MonthYearInput name="testName" startOrEnd="end" onChange={jest.fn(x => lastUpdate = x)} debounce={false} />);

    wrapper.setState({
      month : "11",
      year: "2019"
    });

    wrapper.find("input").first().simulate("change");

    expect(lastUpdate).toEqual(new Date("2019-11-30T12:00:00"));
  });
});
