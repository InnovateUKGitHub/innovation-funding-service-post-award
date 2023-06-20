import { render } from "@testing-library/react";
import { LinksList, LinksListProps } from "@ui/components/linksList";
import { TestBed } from "@shared/TestBed";
import { Link } from "@ui/components/links";

describe("<LinksList />", () => {
  describe("@returns", () => {
    const setup = (props: LinksListProps) =>
      render(
        <TestBed>
          <LinksList {...props} />
        </TestBed>,
      );

    it("with an empty array", () => {
      const stubEmptyList = [] as Link[];
      const { container } = setup({ links: stubEmptyList } as unknown as LinksListProps);

      expect(container.firstChild).toBeNull();
    });

    it("with single link", () => {
      const oneLink = { url: "test1", text: "test-text1" };

      const { container } = setup({ links: [oneLink] });

      const expectedLink = container.querySelector("a");

      if (!expectedLink) throw Error("Link not found :(");

      expect(expectedLink.getAttribute("href")).toBe(oneLink.url);
      expect(expectedLink.getAttribute("target")).toBe("");
      expect(expectedLink.getAttribute("rel")).toBe("");
      expect(expectedLink.classList.item(0)).toBe("govuk-link");
      expect(expectedLink.classList.item(1)).toBe("govuk-!-font-size-19");
      expect(expectedLink.innerHTML).toBe(oneLink.text);
    });

    it("with multiple links", () => {
      const stubLinks = [
        { url: "test1", text: "test-text1" },
        { url: "test2", text: "test-text2" },
        { url: "test3", text: "test-text3" },
      ];

      const { container } = setup({ links: stubLinks });

      const queriedLinks = container.querySelectorAll("a");

      if (!queriedLinks.length) throw Error("No links were found :(");

      queriedLinks.forEach((link, i) => {
        expect(link.getAttribute("href")).toBe(stubLinks[i].url);
        expect(link.getAttribute("target")).toBe("");
        expect(link.getAttribute("rel")).toBe("");
        expect(link.classList.item(0)).toBe("govuk-link");
        expect(link.classList.item(1)).toBe("govuk-!-font-size-19");
        expect(link.innerHTML).toBe(stubLinks[i].text);
      });
    });
  });
});
