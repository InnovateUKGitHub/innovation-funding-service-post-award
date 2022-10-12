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
        name                               | trusted  | bannedStrings                | markdown
        ${"with string"}                   | ${true}  | ${[]}                        | ${"stub-content"}
        ${"with headings"}                 | ${true}  | ${[]}                        | ${stubMarkdownHeading}
        ${"with ordered lists"}            | ${true}  | ${[]}                        | ${"1. stub-ordered-item"}
        ${"with unordered lists"}          | ${true}  | ${[]}                        | ${"* stub-unordered-item"}
        ${"with html and secure enabled"}  | ${true}  | ${[]}                        | ${"<p>Hello world!</p>"}
        ${"with html and secure disabled"} | ${false} | ${["<script>", "</script>"]} | ${'<script>alert("Neil Little")</script>'}
      `("$name", ({ markdown, trusted, bannedStrings }) => {
        const { container } = setup({ value: markdown, trusted });

        // Use snapshot testing to compare Markdown output values
        expect(container.innerHTML).toMatchSnapshot();

        // Ensure that banned values will NEVER be in the markdown output
        for (const bannedString of bannedStrings) {
          expect(container.innerHTML).not.toContain(bannedString);
        }
      });
    });
  });
});
