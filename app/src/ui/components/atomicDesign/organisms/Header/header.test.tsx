import { render } from "@testing-library/react";

import { TestBed } from "@shared/TestBed";
import { Header, HeaderProps } from "@ui/components/atomicDesign/organisms/Header/header";
import { initStubTestIntl } from "@shared/initStubTestIntl";

describe("Header", () => {
  const stubContent = {
    site: {
      header: {
        siteName: "stub-siteName",
        mobileNavigationLabel: "stub-mobileNavigationLabel",
        dashboard: "Dashboard",
        profile: "Profile",
        signOut: "Sign out",
      },
    },
  };

  const defaultProps: HeaderProps = {
    headingLink: "https://www.ukri.org/",
  };

  const setup = (props?: Partial<HeaderProps>) =>
    render(
      <TestBed>
        <Header {...defaultProps} {...props} />
      </TestBed>,
    );

  beforeAll(async () => {
    initStubTestIntl(stubContent);
  });

  describe("@renders", () => {
    it("should return heading link", () => {
      const stubHeadingLink = "https://stub-link.me";
      const { getByText } = setup({ headingLink: stubHeadingLink });

      const siteLink = getByText(stubContent.site.header.siteName);

      expect(siteLink).toHaveAttribute("href", stubHeadingLink);
    });

    describe("with required elements", () => {
      it("with logo", () => {
        const { queryByTestId } = setup();

        expect(queryByTestId("logo")).toBeInTheDocument();
      });

      it("with mobile toggle and label", () => {
        // No items no menu or toggle is shown
        const { queryByTestId, queryByText } = setup({ showMenu: true });

        const mobileNavigationLabel = queryByText(stubContent.site.header.mobileNavigationLabel);

        expect(mobileNavigationLabel).toBeInTheDocument();

        expect(queryByTestId("mobile-nav-toggle")).toBeInTheDocument();
      });
    });

    describe("without navigation items", () => {
      it("with showMenu false", () => {
        const { queryAllByTestId } = setup({ showMenu: false });

        const navItems = queryAllByTestId("header-navigation-item");

        expect(navItems).toHaveLength(0);
      });
    });

    it("with navigation items", () => {
      const { queryByTestId, queryAllByTestId } = setup({});

      const expectedNavItems = queryAllByTestId("header-navigation-item");

      const stubNavItems = [
        { qa: "nav-dashboard", href: /dashboard-selection/ },
        { qa: "nav-profile", href: /profile\/view/ },
        { qa: "nav-sign-out", href: /logout/ },
      ];

      expect(expectedNavItems).toHaveLength(stubNavItems.length);

      // Note: check object renders with expected properties
      for (const stubItem of stubNavItems) {
        const item = queryByTestId(stubItem.qa);

        if (!item) throw Error(`${stubItem.qa} was not found!`);

        expect(item).toBeInTheDocument();
        expect(item.getAttribute("href")).toMatch(stubItem.href);
      }
    });
  });
});
