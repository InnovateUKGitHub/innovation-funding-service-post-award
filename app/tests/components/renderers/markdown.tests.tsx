import "jest";
import Adapter from "enzyme-adapter-react-16";

import React from "react";
import Enzyme, { mount } from "enzyme";
import { IMarkdownProps, Markdown } from "@ui/components/renderers/markdown";
import { findByQa } from "../helpers/find-by-qa";

Enzyme.configure({ adapter: new Adapter() });

describe("Markdown", () => {
  const setup = (props: IMarkdownProps) => mount(<Markdown {...props} />);

  const stubString = "content";

  const stubMarkdownHeading = `
Heading Test
------------
`;
  const stubUnOrderedList = `
* Item 1
* Item 2
  `;

  const stubOrderedList = `
1. Item 1
1. Item 2
  `;

  describe("@renders", () => {
    it("should wrap content in <span>", () => {
      const wrapper = setup({ value: stubString });

      const spanElement = wrapper.getDOMNode();
      expect(spanElement.tagName).toBe("SPAN");
      expect(spanElement).toHaveProperty("className", "govuk-body markdown");
    });

    it("should return null when empty string is passed", () => {
      const emptyString = "";
      const wrapper = setup({ value: emptyString });

      expect(wrapper.html()).toBe(null);
    });

    test.each`
      name                         | markdown               | expected
      ${"handle normal strings"}   | ${stubString}          | ${"content"}
      ${"convert string"}          | ${stubString}          | ${"<p>content</p>"}
      ${"convert headings"}        | ${stubMarkdownHeading} | ${'<h2 id="heading-test">Heading Test</h2></span>'}
      ${"convert unordered lists"} | ${stubUnOrderedList}   | ${"<ul><li>Item 1</li><li>Item 2</li></ul>"}
      ${"convert unordered lists"} | ${stubOrderedList}     | ${"<ol><li>Item 1</li><li>Item 2</li></ol>"}
    `("should $name", ({ markdown, expected }) => {
      const wrapper = setup({ value: markdown });

      // Note: added easily assert single line string
      const htmlWithoutLineBreaks = wrapper.html().replace(/\n/g, "");

      expect(htmlWithoutLineBreaks).toContain(expected);
    });

    it("should return styles", () => {
      const stubStyles = { color: "red" };
      const wrapper = setup({ value: "non-empty-string", style: stubStyles });

      const element = findByQa(wrapper, "markdown").prop("style");

      expect(element).toMatchObject(stubStyles);
    });
  });
});
