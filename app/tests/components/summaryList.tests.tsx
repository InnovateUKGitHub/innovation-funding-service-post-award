import { SummaryList, SummaryListItem, SummaryListProps } from "@ui/components/summaryList";
import { render } from "@testing-library/react";

describe("<SummaryList />", () => {
  const setup = (props: SummaryListProps) => render(<SummaryList {...props} />);

  describe("@returns", () => {
    it("without borders", () => {
      const stubContent = "stub-content";

      const { queryByText } = setup({
        noBorders: true,
        qa: "test-list",
        children: <SummaryListItem label="Label" content={stubContent} qa="test-item" />,
      });

      expect(queryByText(stubContent)).toBeInTheDocument();
    });

    it("with action", () => {
      const stubHref = "#stub-href";

      const { container } = setup({
        qa: "with-action",
        children: (
          <SummaryListItem label="Label" content="Content" action={<a href={stubHref}>Test</a>} qa="test-item" />
        ),
      });

      const link = container.querySelector("a");

      if (!link) throw Error("Link not found!");

      expect(link.getAttribute("href")).toBe(stubHref);
    });

    it("with qa", () => {
      const stubQa = "stub-qa";

      const { queryByTestId } = setup({
        qa: "with-action",
        children: <SummaryListItem qa={stubQa} label="Label" content="Content" action={<a href="#test">Test</a>} />,
      });

      expect(queryByTestId(stubQa)).toBeInTheDocument();
    });
  });
});
