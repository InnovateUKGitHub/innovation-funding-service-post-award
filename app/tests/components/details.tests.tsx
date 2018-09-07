import "jest";
import React from "react";
import { Details } from "../../src/ui/components/details";
import Enzyme, { shallow, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

describe("Details", () => {
  describe("Fields", () => {
    it("String values render title and value", () => {
      const DTest = Details.forData({ name: "example" });
      const output = shallow(<DTest.Details><DTest.String label="Name" value={x => x.name} /></DTest.Details>).html();
      expect(output).toContain(`<h4 class=\"govuk-heading-s\">Name</h4>`);
      expect(output).toContain(`<p class=\"govuk-body\">example</p>`);
    });

    it("Multi line string values render title and value", () => {
      const DTest = Details.forData({ name: "example1\nexample2" });
      const output = shallow(<DTest.Details><DTest.MulilineString label="Name" value={x => x.name} /></DTest.Details>).html();
      expect(output).toContain(`<h4 class=\"govuk-heading-s\">Name</h4>`);
      expect(output).toContain(`<p class=\"govuk-body\">example1</p>`);
      expect(output).toContain(`<p class=\"govuk-body\">example2</p>`);
    });

    it("Date values render title and value", () => {
      const DTest = Details.forData({ created: new Date("2018/12/1") });
      const output = shallow(<DTest.Details><DTest.Date label="Created" value={x => x.created} /></DTest.Details>).html();
      expect(output).toContain(`<h4 class=\"govuk-heading-s\">Created</h4>`);
      expect(output).toContain(`<p class=\"govuk-body\"><span>1 December 2018</span></p>`);
    });

    it("Date time values render title and value", () => {
      const DTest = Details.forData({ created: new Date("2018/12/1 9:08") });
      const output = shallow(<DTest.Details><DTest.DateTime label="Created" value={x => x.created} /></DTest.Details>).html();
      expect(output).toContain(`<h4 class=\"govuk-heading-s\">Created</h4>`);
      expect(output).toContain(`<p class=\"govuk-body\"><span>1 December 2018 09:08</span></p>`);
    });

    it("Custom values render expected content", () => {
      const DTest = Details.forData({ name: "example" });
      const output = shallow(<DTest.Details><DTest.Custom label="Custom" value={x => <p>Custom Content <i>{x.name}</i></p>} /></DTest.Details>).html();
      expect(output).toContain(`<h4 class=\"govuk-heading-s\">Custom</h4>`);
      expect(output).toContain(`<p>Custom Content <i>example</i></p>`);
    });

    it("Number values render expected content", () => {
      const DTest = Details.forData({ cost: 12.22 });
      const output = shallow(<DTest.Details><DTest.Number label="Cost" value={x => x.cost} /></DTest.Details>).html();
      expect(output).toContain(`<h4 class="govuk-heading-s">Cost</h4>`);
      expect(output).toContain(`<p class="govuk-body">12.22</p>`);
    });

    it("Currency values render expected content", () => {
      const DTest = Details.forData({ cost: 12.22 });
      const output = shallow(<DTest.Details><DTest.Currency label="Cost" value={x => x.cost} /></DTest.Details>).html();
      expect(output).toContain(`<h4 class="govuk-heading-s">Cost</h4>`);
      expect(output).toContain(`<p class="govuk-body"><span>£ 12.22</span></p>`);
    });
  });

  describe("Single Column", () => {
    const DTest = Details.forData({ id:1, name: "example", cost: 100 });
    const wrapper = mount(
      <DTest.Details>
        <DTest.Number label="Id" value={x => x.id} />
        <DTest.String label="Name" value={x => x.name} />
        <DTest.Currency label="Cost" value={x => x.cost} />
      </DTest.Details>
        );

    expect(wrapper.find("div.govuk-grid-row").length).toBe(3);

    expect(wrapper.find("div.govuk-grid-row").at(0).find("div.govuk-grid-column-one-quarter").length).toBe(1);
    expect(wrapper.find("div.govuk-grid-row").at(0).find("div.govuk-grid-column-three-quarters").length).toBe(1);

    expect(wrapper.find("div.govuk-grid-row").at(1).find("div.govuk-grid-column-one-quarter").length).toBe(1);
    expect(wrapper.find("div.govuk-grid-row").at(1).find("div.govuk-grid-column-three-quarters").length).toBe(1);

    expect(wrapper.find("div.govuk-grid-row").at(2).find("div.govuk-grid-column-one-quarter").length).toBe(1);
    expect(wrapper.find("div.govuk-grid-row").at(2).find("div.govuk-grid-column-three-quarters").length).toBe(1);
  });

  describe("Double Column", () => {
    const DTest = Details.forData({ id:1, name: "example", cost: 100 });
    const wrapper = mount(
      <DTest.Details layout="Double">
        <DTest.Number label="Id" value={x => x.id} />
        <DTest.String label="Name" value={x => x.name} />
        <DTest.Currency label="Cost" value={x => x.cost} />
      </DTest.Details>
        );

    expect(wrapper.find("div.govuk-grid-row").length).toBe(2);
    expect(wrapper.find("div.govuk-grid-row").at(0).find("div.govuk-grid-column-one-quarter").length).toBe(4);
    expect(wrapper.find("div.govuk-grid-row").at(1).find("div.govuk-grid-column-one-quarter").length).toBe(2);
  });
});
