import { render } from "@testing-library/react";

import { IMarkdownProps, Markdown } from "@ui/components/renderers/markdown";

describe("Markdown", () => {
  const setup = (props: IMarkdownProps) => render(<Markdown {...props} />);

  const stubMarkdownHeading = `
Heading Test
------------
`;

  describe("@renders", () => {
    it("should wrap content in <span>", () => {
      const { container } = setup({ value: "some-valid-string" });

      if (!container.firstChild) {
        throw Error("First child not found!");
      }

      expect(container.firstChild.nodeName).toBe("SPAN");
    });

    it("should have markdown class for style overrides", () => {
      const { container } = setup({ value: "some-valid-string" });

      if (!container.firstChild) {
        throw Error("First child not found!");
      }

      expect(container.firstChild).toHaveClass("markdown");
    });

    it("should return null when empty string is passed", () => {
      const { container } = setup({ value: "" });

      expect(container.firstChild).toBeNull();
    });

    it("should return styles", () => {
      const stubColorStyleValue = "red";

      const { container } = setup({ value: "non-empty-string", style: { color: stubColorStyleValue } });

      expect(container.firstChild).toHaveStyle(`color: ${stubColorStyleValue}`);
    });

    describe("with converted markdown parsed correctly", () => {
      test.each`
        name                      | markdown                   | parsedNodes     | expected
        ${"with string"}          | ${"stub-content"}          | ${["p"]}        | ${"<p>stub-content</p>"}
        ${"with headings"}        | ${stubMarkdownHeading}     | ${["h2"]}       | ${'<h2 id="heading-test">Heading Test</h2></span>'}
        ${"with ordered lists"}   | ${"1. stub-ordered-item"}  | ${["ol", "li"]} | ${"<ol><li>stub-ordered-item</li></ol>"}
        ${"with unordered lists"} | ${"* stub-unordered-item"} | ${["ul", "li"]} | ${"<ul><li>stub-unordered-item</li></ul>"}
      `("$name", ({ markdown, parsedNodes, expected }) => {
        const { queryByText, container } = setup({ value: markdown });

        // Note: This is a simple parser, mutlitple elements will fail. Consider testing refactor to cater to more scenarios!
        const parseHtmlToExpectedText = expected.replace(/<[^>]+>/g, "");
        const targetElement = queryByText(parseHtmlToExpectedText);

        expect(targetElement).toBeInTheDocument();

        for (const node of parsedNodes) {
          const targetNode = container.querySelector(node);

          if (!targetNode) throw Error(`It appears "${node}" was not found!`);

          expect(targetNode).toBeInTheDocument();
        }
      });
    });
  });
});
