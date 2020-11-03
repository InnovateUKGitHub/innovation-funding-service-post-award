import React from "react";
import { mount, shallow } from "enzyme";
import { Accordion, AccordionItem } from "../../src/ui/components";

describe("Accordion", () => {
  it("Renders with correct class", () => {
    const output = shallow(<Accordion/>).html();
    expect(output).toContain(`class=\"govuk-accordion\"`);
  });

  it("Renders with given children", () => {
    const output = shallow(<Accordion><span>child1</span><span>child2</span></Accordion>).html();
    expect(output).toContain(`child1`);
    expect(output).toContain(`child2`);
  });

  describe("Open / Close all", () => {
    const getAccordion = () => mount(
      <Accordion>
        <AccordionItem title="testTitle1">
          <span id="child1">child1text</span>
        </AccordionItem>
        <AccordionItem title="testTitle2">
          <span id="child2">child1text</span>
        </AccordionItem>
        <AccordionItem title="testTitle3">
          <span id="child3">child1text</span>
        </AccordionItem>
      </Accordion>);

    const collapseItemSelector = "span.govuk-accordion__icon";
    const accordionControlsButtonSelector = ".govuk-accordion__controls button";
    const openAllButtonSelector = "button.govuk-accordion__open-all";
    const expandedSectionSelector = "div.govuk-accordion__section--expanded";

    it("Displays 'Close all' button when all the items are expanded", () => {
      const component = getAccordion();
      component.find(collapseItemSelector).forEach(x => x.simulate("click"));
      expect(component.find(accordionControlsButtonSelector).text()).toEqual("Close all sections");
    });

    it("Displays 'Open all' button when some of the items are collapsed", () => {
      const component = getAccordion();
      component.find(collapseItemSelector).first().simulate("click");
      expect(component.find(accordionControlsButtonSelector).text()).toEqual("Open all sections");
    });

    it("Displays 'Open all' button when all the items are collapsed", () => {
      const component = getAccordion();
      expect(component.find(accordionControlsButtonSelector).text()).toEqual("Open all sections");
    });

    it("Expands all the accordion items when 'Open all' button is clicked", () => {
      const component = getAccordion();
      component.find(openAllButtonSelector).simulate("click");
      expect(component.find(expandedSectionSelector).length).toBe(3);
    });

    it("Collapses all the accordion items when 'Close all' button is clicked", () => {
      const component = getAccordion();
      component.find(collapseItemSelector).forEach(x => x.simulate("click"));
      component.find(openAllButtonSelector).simulate("click");
      expect(component.find(expandedSectionSelector).length).toBe(0);
    });

    it("expands the section after all collapsed when the section expand icon is clicked", () => {
      const component = getAccordion();
      component.find(collapseItemSelector).forEach(x => x.simulate("click"));
      component.find(openAllButtonSelector).simulate("click");
      component.find(collapseItemSelector).first().simulate("click");
      expect(component.find(expandedSectionSelector).length).toBe(1);
    });

    it("collapses the section after all expanded when the section collapse icon is clicked", () => {
      const component = getAccordion();
      component.find(openAllButtonSelector).simulate("click");
      component.find(collapseItemSelector).first().simulate("click");
      expect(component.find(expandedSectionSelector).length).toBe(2);
    });
  });
});
