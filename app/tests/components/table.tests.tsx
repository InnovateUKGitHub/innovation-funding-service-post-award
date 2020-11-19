import React from "react";
import { TypedTable } from "../../src/ui/components/table";
// tslint:disable-next-line: import-blacklist
import { shallow } from "enzyme";

describe("Table", () => {
  it("should render <td> with given number", () => {

    const NumericTable = TypedTable<number>();
    const wrapper = shallow(<NumericTable.Table data={[1]} qa=""><NumericTable.Number header="" value={x => x} qa="val"/></NumericTable.Table>);
    expect(wrapper.html()).toContain(`<td class="govuk-table__cell govuk-table__cell--numeric">1</td>`);
  });

  it("should render <td> with given string", () => {
    const StringTable = TypedTable<string>();
    const wrapper = shallow(<StringTable.Table data={["aBc"]} qa=""><StringTable.String header="" value={x => x} qa="val"/></StringTable.Table>);
    expect(wrapper.html()).toContain(`<td class="govuk-table__cell">aBc</td>`);
  });

  it("should render <tr> with number nodes", () => {
    const rows    = [1,2,3];
    const NumberTable  = TypedTable<number>();
    const wrapper = shallow(<NumberTable.Table data={rows} qa=""><NumberTable.Number header="" value={x => x} qa="val"/></NumberTable.Table>);
    expect(wrapper.html()).toContain(`<td class="govuk-table__cell govuk-table__cell--numeric">1</td>`);
    expect(wrapper.html()).toContain(`<td class="govuk-table__cell govuk-table__cell--numeric">2</td>`);
    expect(wrapper.html()).toContain(`<td class="govuk-table__cell govuk-table__cell--numeric">3</td>`);
  });

  it("should render th with given content", () => {
    const data = ["Item"];
    const TableComponent  = TypedTable<string>();

    const wrapper = shallow(<TableComponent.Table data={data} qa=""><TableComponent.String header="The header" value={x => "Content"} qa="val"/></TableComponent.Table>);
    expect(wrapper.html()).toContain(`<th class="govuk-table__header" scope="col">The header</th>`);
  });

  it("should render hidden header with given content", () => {
    const data = ["Item"];
    const TableComponent  = TypedTable<string>();

    const wrapper = shallow(<TableComponent.Table data={data} qa=""><TableComponent.String header="The header" hideHeader={true} value={x => "Content"} qa="val"/></TableComponent.Table>);
    expect(wrapper.html()).toContain(`<th class="govuk-table__header" scope="col"><span class="govuk-visually-hidden">The header</span></th>`);
  });

  it("should render tr as expected", () => {
    const data = ["Item"];
    const TableComponent  = TypedTable<string>();

    const wrapper = shallow(<TableComponent.Table data={data} qa=""><TableComponent.String header="The header" value={x => x} qa="val"/></TableComponent.Table>);
    expect(wrapper.html()).toContain(`<tr class="govuk-table__row"><td class="govuk-table__cell">Item</td></tr>`);
  });
});
