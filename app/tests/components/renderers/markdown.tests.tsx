// tslint:disable
import "jest";
import React from "react";
import Adapter from "enzyme-adapter-react-16";
import Enzyme, { shallow, mount } from "enzyme";
import { Markdown } from "@ui/components/renderers/markdown";

Enzyme.configure({ adapter: new Adapter() });

describe("Markdown", () => {
  it("should wrap content in styles span", () => {
    const expected = "content";
    const result = mount(<Markdown value={expected}/>);

    const elem = result.getDOMNode();
    expect(elem.tagName).toBe("SPAN");
    expect(elem).toHaveProperty("className", "govuk-body markdown");
  });

  it("should return null if no content", () => {
    const expected = "";
    const result = mount(<Markdown value={expected}/>);

    expect(result.html()).toBeNull();
  });

  it("should return null if content is null", () => {
    const expected = null;
    const result = mount(<Markdown value={expected}/>);

    expect(result.html()).toBeNull();
  });

  it("should handle normal strings", () => {
    const expected = "content";
    const result = mount(<Markdown value={expected}/>);

    expect(result.html()).toContain("<p>content</p>");
  });

  it("should convert headings", () => {
    const expected = `
Heading Test
------------
    `;
    const result = mount(<Markdown value={expected}/>);

    expect(result.html()).toContain("<h2 id=\"heading-test\">Heading Test</h2>");
  });

  it("should convert unordered lists", () => {
    const expected = `
* Item 1
* Item 2
    `;
    const result = mount(<Markdown value={expected}/>);

    expect(result.html().replace(/\n/g, ``)).toContain(`<ul><li>Item 1</li><li>Item 2</li></ul>`);
  });

  it("should convert ordered lists", () => {
    const expected = `
1. Item 1
1. Item 2
    `;
    const result = mount(<Markdown value={expected}/>);

    expect(result.html().replace(/\n/g, ``)).toContain(`<ol><li>Item 1</li><li>Item 2</li></ol>`);
  });


});

