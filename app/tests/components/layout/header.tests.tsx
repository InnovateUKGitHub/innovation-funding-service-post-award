import { render } from "@testing-library/react";

import { TestBed, TestBedContent } from "@shared/TestBed";
import { Header, HeaderProps } from "@ui/components/layout/header";

describe("Header", () => {
  const stubContent = {
    header: {
      siteName: "stub-siteName",
      mobileNavigationLabel: {
        content: "stub-mobileNavigationLabel",
      },
    },
  };

  const getStubItems = (totalNumberOfItems: number) =>
    Array.from({ length: totalNumberOfItems }, (_, i) => ({
      text: `text-${i}`,
      href: `href-${i}`,
      qa: `qa-${i}`,
    }));

  const defaultProps = {
    siteLink: "www.google.com",
  };

  const setup = (props?: Partial<HeaderProps>) =>
    render(
      <TestBed content={stubContent as TestBedContent}>
        <Header {...defaultProps} {...props} />
      </TestBed>,
    );

  describe("@renders", () => {
    it("should return site link", () => {
      const stubSiteLink = "https://www.ukri.org/";
      const { getByText } = setup({ siteLink: stubSiteLink });

      const siteLink = getByText(stubContent.header.siteName);

      expect(siteLink).toHaveAttribute("href", stubSiteLink);
    });

    it("should return content from context", () => {
      const { queryByText } = setup();

      expect(queryByText(stubContent.header.siteName)).toBeInTheDocument();
      expect(queryByText(stubContent.header.mobileNavigationLabel.content)).toBeInTheDocument();
    });

    describe("with required elements", () => {
      test.each`
        name                        | qa
        ${"with logo"}              | ${"logo"}
        ${"with mobile-nav-toggle"} | ${"mobile-nav-toggle"}
      `("$name", ({ qa }) => {
        const { queryByTestId } = setup();
        expect(queryByTestId(qa)).toBeInTheDocument();
      });
    });

    describe("without navigation items", () => {
      it("with no items", () => {
        const { queryAllByTestId } = setup({ navigationItems: [] });

        const navItems = queryAllByTestId("header-navigation-item");

        expect(navItems).toHaveLength(0);
      });

      it("when a value is falsy", () => {
        const { queryAllByTestId } = setup({ navigationItems: undefined });

        const navItems = queryAllByTestId("header-navigation-item");

        expect(navItems).toHaveLength(0);
      });
    });

    it("with navigation items", () => {
      const stubNavItems = getStubItems(2);
      const { queryByTestId, queryAllByTestId } = setup({ navigationItems: stubNavItems });

      const expectedNavItems = queryAllByTestId("header-navigation-item");

      expect(expectedNavItems).toHaveLength(stubNavItems.length);

      // Note: check object renders with expected properties
      for (const stubItem of stubNavItems) {
        const item = queryByTestId(stubItem.qa);

        if (!item) throw Error(`${stubItem.qa} was not found!`);

        expect(item).toBeInTheDocument();
        expect(item.getAttribute("href")).toBe(stubItem.href);
      }
    });
  });
});
