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

  const getStubItems = (totalNumberOfItems: number): NonNullable<HeaderProps["menuItems"]> => {
    return Array.from({ length: totalNumberOfItems }, (_, i) => ({
      text: `text-${i}`,
      href: `href-${i}`,
      qa: `qa-${i}`,
    }));
  };

  const defaultProps: HeaderProps = {
    headingLink: "https://www.ukri.org/",
  };

  const setup = (props?: Partial<HeaderProps>) =>
    render(
      <TestBed content={stubContent as TestBedContent}>
        <Header {...defaultProps} {...props} />
      </TestBed>,
    );

  describe("@renders", () => {
    it("should return heading link", () => {
      const stubHeadingLink = "https://stub-link.me";
      const { getByText } = setup({ headingLink: stubHeadingLink });

      const siteLink = getByText(stubContent.header.siteName);

      expect(siteLink).toHaveAttribute("href", stubHeadingLink);
    });

    it("should return mobile navigation label", () => {
      const { queryByText } = setup();

      const mobileNavigationLabel = queryByText(stubContent.header.mobileNavigationLabel.content);

      expect(mobileNavigationLabel).toBeInTheDocument();
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
      it("with defined list but no items", () => {
        const { queryAllByTestId } = setup({ menuItems: [] });

        const navItems = queryAllByTestId("header-navigation-item");

        expect(navItems).toHaveLength(0);
      });

      it("when no list is provided", () => {
        const { queryAllByTestId } = setup();

        const navItems = queryAllByTestId("header-navigation-item");

        expect(navItems).toHaveLength(0);
      });
    });

    it("with navigation items", () => {
      const stubNavItems = getStubItems(2);
      const { queryByTestId, queryAllByTestId } = setup({ menuItems: stubNavItems });

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
