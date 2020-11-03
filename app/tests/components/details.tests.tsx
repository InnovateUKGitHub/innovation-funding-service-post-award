// tslint:disable:no-duplicate-string
import React from "react";
import {DualDetails, TypedDetails} from "../../src/ui/components/details";
import { mount, shallow } from "enzyme";

describe("Details", () => {
  describe("Fields", () => {
    it("String values render title and value", () => {
      const example = { name: "example" };
      const DTest = TypedDetails<typeof example>();
      const output = shallow(<DTest.Details data={example}><DTest.String label="Name" qa="name" value={x => x.name} /></DTest.Details>).html();
      expect(output).toContain(`<p class=\"govuk-heading-s\">Name</p>`);
      expect(output).toContain(`<p class=\"govuk-body\">example</p>`);
    });

    it("Multi line string values render title and value", () => {
      const example = { name: "example1\nexample2" };
      const DTest = TypedDetails<typeof example>();
      const output = shallow(<DTest.Details data={example}><DTest.MultilineString label="Name" qa="name" value={x => x.name} /></DTest.Details>).html();
      expect(output).toContain(`<p class=\"govuk-heading-s\">Name</p>`);
      expect(output).toContain(`<p class=\"govuk-body\">example1</p>`);
      expect(output).toContain(`<p class=\"govuk-body\">example2</p>`);
    });

    it("Date values render title and value", () => {
      const example = { created: new Date("2018/12/1") };
      const DTest = TypedDetails<typeof example>();
      const output = shallow(<DTest.Details data={example}><DTest.Date label="Created" qa="created" value={x => x.created} /></DTest.Details>).html();
      expect(output).toContain(`<p class=\"govuk-heading-s\">Created</p>`);
      expect(output).toContain(`<p class=\"govuk-body\"><span>1 December 2018</span></p>`);
    });

    it("Date time values render title and value", () => {
      const example = { created: new Date("2018/12/1 9:08") };
      const DTest = TypedDetails<typeof example>();
      const output = shallow(<DTest.Details data={example}><DTest.DateTime label="Created" qa="created" value={x => x.created} /></DTest.Details>).html();
      expect(output).toContain(`<p class=\"govuk-heading-s\">Created</p>`);
      expect(output).toContain(`<p class=\"govuk-body\"><span>1 December 2018, 9:08am</span></p>`);
    });

    it("Custom values render expected content", () => {
      const example = { name: "example" };
      const DTest = TypedDetails<typeof example>();
      const output = shallow(<DTest.Details data={example}><DTest.Custom label="Custom" qa="custom" value={x => <p>Custom Content <i>{x.name}</i></p>} /></DTest.Details>).html();
      expect(output).toContain(`<p class=\"govuk-heading-s\">Custom</p>`);
      expect(output).toContain(`<p>Custom Content <i>example</i></p>`);
    });

    it("Number values render expected content", () => {
      const example = { cost: 12.22 };
      const DTest = TypedDetails<typeof example>();
      const output = shallow(<DTest.Details data={example}><DTest.Number label="Cost" qa="cost" value={x => x.cost} /></DTest.Details>).html();
      expect(output).toContain(`<p class="govuk-heading-s">Cost</p>`);
      expect(output).toContain(`<p class="govuk-body">12.22</p>`);
    });

    it("Currency values render expected content", () => {
      const example = { cost: 12.22 };
      const DTest = TypedDetails<typeof example>();
      const output = shallow(<DTest.Details data={example}><DTest.Currency fractionDigits={2} label="Cost" qa="cost" value={x => x.cost} /></DTest.Details>).html();
      expect(output).toContain(`<p class="govuk-heading-s">Cost</p>`);
      expect(output).toContain(`<p class="govuk-body"><span style="white-space:nowrap">£12.22</span></p>`);
    });
  });

  describe("Single Column", () => {
    const example = { id:1, name: "example", cost: 100 };
    const DTest = TypedDetails<typeof example>();
    const wrapper = mount(
      <DTest.Details data={example} labelWidth="Narrow">
        <DTest.Number label="Id" qa="id" value={x => x.id} />
        <DTest.String label="Name" qa="name" value={x => x.name} />
        <DTest.Currency label="Cost" qa="cost" value={x => x.cost} />
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
    const example = { id:1, name: "example", cost: 100 };
    const DTest = TypedDetails<typeof example>();
    const wrapper = mount(
        <DualDetails>
            <DTest.Details data={example}>
                <DTest.Number label="Id" qa="id" value={x => x.id} />
                <DTest.String label="Name" qa="name" value={x => x.name} />
            </DTest.Details>
            <DTest.Details data={example}>
                <DTest.Currency label="Cost" qa="cost" value={x => x.cost} />
            </DTest.Details>
        </DualDetails>
        );

    expect(wrapper.find("div.govuk-grid-row").length).toBe(4);
    expect(wrapper
        .find("div.govuk-grid-row").at(0)
        .find("div.govuk-grid-column-one-half")
        .length).toBe(8);
    expect(wrapper
        .find("div.govuk-grid-row").at(0)
        .find("div.govuk-grid-column-one-half").at(0)
        .find("div.govuk-grid-row")
        .length).toBe(2);
  });
});
