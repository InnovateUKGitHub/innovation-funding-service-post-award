import { render } from "@testing-library/react";

import { TestBed } from "@shared/TestBed";
import {
  SummaryList,
  SummaryListItem,
  SummaryListProps,
} from "@ui/components/atomicDesign/molecules/SummaryList/summaryList";

describe("<SummaryList />", () => {
  const setup = (props: SummaryListProps) =>
    render(
      <TestBed>
        <SummaryList {...props} />
      </TestBed>,
    );

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

    it("renders markdown content adequately", () => {
      const stubContent = `There is a thing to be done \`abc.com\` yes there is.

I hate to break it to you.

> He said I should do it`;
      const { container } = setup({
        qa: "with-action",
        children: <SummaryListItem label="Label" content={stubContent} qa="test-item" isMarkdown />,
      });
      expect(container).toMatchSnapshot();
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
