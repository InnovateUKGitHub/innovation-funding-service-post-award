import { render } from "@testing-library/react";

import { SectionPanel, SectionPanelProps } from "@ui/components/atomicDesign/molecules/SectionPanel/sectionPanel";
import { govukBorderColour } from "@ui/styles/colours";

describe("<SectionPanel />", () => {
  const defaultProps: SectionPanelProps = {
    children: <p>no content</p>,
  };

  const setup = (props?: Partial<SectionPanelProps>) => render(<SectionPanel {...defaultProps} {...props} />);

  describe("@renders", () => {
    describe("with content", () => {
      it("with children as element", () => {
        const stubContent = "stub-content";
        const { queryByText } = setup({ children: <p>{stubContent}</p> });

        expect(queryByText(stubContent)).toBeInTheDocument();
      });

      it("with a title", () => {
        const stubTitle = "stib-content";
        const { queryByRole } = setup({ title: stubTitle });

        const titleElement = queryByRole("heading", { name: new RegExp(stubTitle) });

        expect(titleElement).toBeInTheDocument();
      });

      it("with both title and children", () => {
        const stubTitle = "stib-title-with-content";
        const stubContent = "stib-content-with-title";

        const { queryByText, queryByRole } = setup({ title: stubTitle, children: <p>{stubContent}</p> });

        const titleElement = queryByRole("heading", { name: new RegExp(stubTitle) });

        expect(titleElement).toBeInTheDocument();
        expect(queryByText(stubContent)).toBeInTheDocument();
      });
    });

    it("with expected ui styles", () => {
      const { container } = setup();

      expect(container.firstChild).toHaveStyle(`border: 1px solid  ${govukBorderColour}`);
    });
  });
});
