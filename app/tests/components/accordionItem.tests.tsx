// tslint:disable:no-duplicate-string
import React from "react";
import { mount } from "enzyme";

import { AccordionItem } from "../../src/ui/components";

describe("AccordionItem", () => {
  it("Renders with correct class", () => {
    const output = mount(<AccordionItem title="test1" />);
    expect(output.find("div.govuk-accordion__section").length).toBe(1);
  });

  it("Renders as closed", () => {
    const output = mount(<AccordionItem title="test1" />);
    expect(output.state("accordionOpen")).toBe(false);
  });

  it("Renders given title", () => {
    const output = mount(<AccordionItem title="testTitle" />);
    expect(output.find("div.govuk-accordion__section-header").find(".govuk-accordion__section-heading").text()).toBe("testTitle");
  });

  it("Displays no children when closed", () => {
    const output = mount(<AccordionItem title="testTitle"><span id="child1">child1text</span></AccordionItem>);
    output.setState({ accordionOpen: false });
    expect(output.find("div.govuk-accordion__section--expanded").length).toBe(0);
  });

  it("Displays children when open", () => {
    const output = mount(<AccordionItem title="testTitle"><span id="child1">child1text</span></AccordionItem> );
    output.setState({ accordionOpen: true });
    expect(output.find("div.govuk-accordion__section--expanded").length).toBe(1);
  });

  it("Renders given children", () => {
    const output = mount(<AccordionItem title="testTitle"><span id="child1">child1text</span></AccordionItem>);
    output.setState({ accordionOpen: true });
    expect(output.find("#child1").length).toBe(1);
    expect(output.find("#child1").text()).toBe("child1text");
  });
});
