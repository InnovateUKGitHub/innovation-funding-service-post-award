import "jest";
import React from "react";
import { Table } from "../../src/components/table";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("Table", () => {
  it("should render <td> with given number", () => {
    
    const NumericTable = Table.forData([1]);
    const wrapper = shallow(<NumericTable.Table><NumericTable.Number header="" value={x => x}/></NumericTable.Table>);
    expect(wrapper.html()).toContain(`<td class="govuk-table__cell govuk-table__cell--numeric">1</td>`);
  });

  it("should render <td> with given string", () => {
    const StringTable = Table.forData(["aBc"]);
    const wrapper = shallow(<StringTable.Table><StringTable.String header="" value={x => x}/></StringTable.Table>);
    expect(wrapper.html()).toContain(`<td class="govuk-table__cell">aBc</td>`);
  });

  it("should render <tr> with number nodes", () => {
    const rows    = [1,2,3];
    const NumberTable  = Table.forData(rows);
    const wrapper = shallow(<NumberTable.Table><NumberTable.Number header="" value={x => x}/></NumberTable.Table>);
    expect(wrapper.html()).toContain(`<td class="govuk-table__cell govuk-table__cell--numeric">1</td>`);
    expect(wrapper.html()).toContain(`<td class="govuk-table__cell govuk-table__cell--numeric">2</td>`);
    expect(wrapper.html()).toContain(`<td class="govuk-table__cell govuk-table__cell--numeric">3</td>`);
  });

  it("should render th with given content", () => {
      const TableComponent  = Table.forData([]);
      
      const wrapper = shallow(<TableComponent.Table><TableComponent.String header="The header" value={x => "Content"}/></TableComponent.Table>);
      expect(wrapper.html()).toContain(`<th class="govuk-table__header" scope="col">The header</th>`);
  });

  it("should render tr as expected", () => {
    const TableComponent  = Table.forData(["Item"]);
    
    const wrapper = shallow(<TableComponent.Table><TableComponent.String header="The header" value={x => x}/></TableComponent.Table>);
    expect(wrapper.html()).toContain(`<tr class="govuk-table__row"><td class="govuk-table__cell">Item</td></tr>`);
  });
});
