// tslint:disable:no-duplicate-string
import "jest";
import React from "react";
import Enzyme, { mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { AccordionItem } from "../../src/ui/components";

Enzyme.configure({ adapter: new Adapter() });

describe("AccordionItem", () => {
  it("Renders with correct class", () => {
    const output = mount(<AccordionItem title="test1" />);
    expect(output.find("div.acc-accordion__section").length).toBe(1);
  });

  it("Renders as closed", () => {
    const output = mount(<AccordionItem title="test1" />);
    expect(output.state("accordionOpen")).toBe(false);
  });

  it("Renders given title", () => {
    const output = mount(<AccordionItem title="testTitle" />);
    expect(output.find("div.acc-accordion__section-header").find(".govuk-heading-m").text()).toBe("testTitle");
  });

  it("Renders given closedAltText", () => {
    const output = mount(<AccordionItem title="testTitle" closedAltText="testClosedText" />);
    expect(output.find("div.acc-accordion__section-header").find("img").prop("alt")).toBe("testClosedText");
  });

  it("Renders given openAltText", () => {
    const output = mount(<AccordionItem title="testTitle" openAltText="testOpenText" />);
    output.setState({ accordionOpen: true });
    expect(output.find("div.acc-accordion__section-header").find("img").prop("alt")).toBe("testOpenText");
  });

  it("Renders no children when closed", () => {
    const output = mount(<AccordionItem title="testTitle"><span id="child1">child1text</span></AccordionItem>);
    expect(output.find("#child1").length).toBe(0);
  });

  it("Renders given children when open", () => {
    const output = mount(<AccordionItem title="testTitle"><span id="child1">child1text</span></AccordionItem>);
    output.setState({ accordionOpen: true });
    expect(output.find("#child1").length).toBe(1);
    expect(output.find("#child1").text()).toBe("child1text");
  });
});
