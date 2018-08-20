import "jest";
// import React from "react";
import * as Table from "../../src/components/table";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("Table", () => {
  describe("renderNode", () => {
    it("should render <td> with given number", () => {
      const result  = Table.renderNode(1);
      const wrapper = shallow(result);
      expect(wrapper.html()).toEqual(`<td class="govuk-table__cell" scope="row">1</td>`);
    });

    it("should render <td> with given string", () => {
      const result  = Table.renderNode("aBc");
      const wrapper = shallow(result);
      expect(wrapper.html()).toEqual(`<td class="govuk-table__cell" scope="row">aBc</td>`);
    });
  });

  describe("renderRow", () => {
    it("should render <tr> with empty nodes", () => {
      const rows    = [];
      const result  = Table.renderRow(rows);
      const wrapper = shallow(result);
      expect(wrapper.html()).toEqual(`<tr class="govuk-table__row"></tr>`);
    });

    it("should render <tr> with number nodes", () => {
      const rows    = [1,2,3];
      const result  = Table.renderRow(rows);
      const wrapper = shallow(result);
      expect(wrapper.html()).toContain(`<td class="govuk-table__cell" scope="row">1</td>`);
      expect(wrapper.html()).toContain(`<td class="govuk-table__cell" scope="row">2</td>`);
      expect(wrapper.html()).toContain(`<td class="govuk-table__cell" scope="row">3</td>`);
    });
  });

  describe("renderTableHeading", () => {
    it("should render th with given number", () => {
      const result  = Table.renderTableHeading(1);
      const wrapper = shallow(result);
      expect(wrapper.html()).toEqual(`<th class="govuk-table__header" scope="col">1</th>`);
    });
  });

  describe("TableComponent", () => {
    it("should render correct html", () => {
      const data    = [];
      const result  = Table.TableComponent(data)({ children: [] });
      const wrapper = shallow(result);
      expect(wrapper.html()).toEqual(`<div><table class="govuk-table"><thead class="govuk-table__head"><tr class="govuk-table__row"></tr></thead><tbody class="govuk-table__body"></tbody></table></div>`);
    });
  });

  describe("renderColumn", () => {
    const renderer = (x) => x;

    it("should render null with undefined", () => {
      const result = Table.renderColumn(renderer, undefined);
      expect(result).toBeNull();
    });

    it("should render null with null", () => {
      const result = Table.renderColumn(renderer, null);
      expect(result).toBeNull();
    });

  });
});
