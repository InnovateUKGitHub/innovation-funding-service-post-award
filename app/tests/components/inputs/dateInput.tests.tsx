// tslint:disable:no-duplicate-string no-identical-functions
import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { FullDateInput, MonthYearInput } from "@ui/components/inputs/dateInput";

Enzyme.configure({ adapter: new Adapter() });

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

  it("Doesn't update component state with invalid values", () => {
    const wrapper = mount(<FullDateInput name="testName" />);

    const dayInput = wrapper.find("input").first();
    const monthInput = wrapper.find("input").at(1);
    const yearInput = wrapper.find("input").last();
    (dayInput.instance() as any).value = "wrong";
    dayInput.simulate("change");
    (monthInput.instance() as any).value = "invalid";
    monthInput.simulate("change");
    (yearInput.instance() as any).value = "not OK";
    yearInput.simulate("change");

    expect(wrapper.state("day")).toEqual("");
    expect(wrapper.state("month")).toEqual("");
    expect(wrapper.state("year")).toEqual("");
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

  it("Doesn't update component state with invalid values", () => {
    const wrapper = mount(<MonthYearInput name="testName" startOrEnd="start" />);

    const monthInput = wrapper.find("input").first();
    const yearInput = wrapper.find("input").last();
    (monthInput.instance() as any).value = "invalid";
    monthInput.simulate("change");
    (yearInput.instance() as any).value = "not OK";
    yearInput.simulate("change");

    expect(wrapper.state("month")).toEqual("");
    expect(wrapper.state("year")).toEqual("");
  });

  it("Sets the date to the first day of the month", async (done) => {
    const onChangeMock = jest.fn();
    const wrapper = mount(<MonthYearInput name="testName" startOrEnd="start" onChange={onChangeMock} />);

    const monthInput = wrapper.find("input").first();
    (monthInput.instance() as any).value = "11";
    monthInput.simulate("change");
    const yearInput = wrapper.find("input").last();
    (yearInput.instance() as any).value = "2019";
    yearInput.simulate("change");

    await new Promise(resolve => setTimeout(() => resolve(), 500));

    expect(onChangeMock).toBeCalledWith(new Date("2019-11-01T12:00:00"));
    done();
  });

  it("Sets the date to the last day of the month", async (done) => {
    const onChangeMock = jest.fn();
    const wrapper = mount(<MonthYearInput name="testName" startOrEnd="end" onChange={onChangeMock} />);

    const monthInput = wrapper.find("input").first();
    (monthInput.instance() as any).value = "11";
    monthInput.simulate("change");
    const yearInput = wrapper.find("input").last();
    (yearInput.instance() as any).value = "2019";
    yearInput.simulate("change");

    await new Promise(resolve => setTimeout(() => resolve(), 500));

    expect(onChangeMock).toBeCalledWith(new Date("2019-11-30T12:00:00"));
    done();
  });
});
