import "jest";
import React from "react";
import Enzyme, {mount} from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import {ContentProvider} from "@ui/redux";
import {Header, HeaderProps} from "@ui/components/layout/header";
import {getDataQA} from "../../test-utils/getQaRef";

Enzyme.configure({adapter: new Adapter()});

describe("Header", () => {
    const setup = (props: Partial<HeaderProps> = {}) => {
        // Testbed
        const stubProvider = {
            header: {
                siteName: "stub-siteName",
                mobileNavigationLabel: {
                    content: "stub-mobileNavigationLabel"
                },
            }
        };

        // Stub Data
        const stubUrl = "www.google.com";
        const stubNavItems = Array.from({length: 3}, (_, i) => ({
            text: `text-${i}`,
            href: `href-${i}`,
            qa: `qa-${i}`,
        }));

        const wrapper = mount(
            <ContentProvider value={stubProvider as any}>
                <Header siteLink={stubUrl} navigationItems={stubNavItems} {...props} />
            </ContentProvider>
        );

        return {
            wrapper,
            stubUrl,
            stubNavItems,
            stubProvider
        };
    };

    describe("@data", () => {
        it("should return content from context", () => {
            const {wrapper, stubProvider} = setup();

            const siteName = getDataQA(wrapper, "service-name");
            const mobileNavToggle = getDataQA(wrapper, "mobile-nav-toggle");

            expect(siteName.text()).toBe(stubProvider.header.siteName);
            expect(mobileNavToggle.text()).toBe(stubProvider.header.mobileNavigationLabel.content);
        });
    });

    describe("@renders", () => {
        it("renders no navigation items", () => {
            const {wrapper} = setup({ navigationItems: [] });

            const navItems = getDataQA(wrapper, "header-navigation-item");

            expect(navItems.length).toBe(0);
        });

        it("renders navigation items", () => {
            const {wrapper, stubNavItems} = setup();

            const navItems = getDataQA(wrapper, "header-navigation-item");

            // Note: check object renders with expected properties
            stubNavItems.forEach(stubItem => {
                const item = getDataQA(wrapper, stubItem.qa);
                expect(item.text()).toBe(stubItem.text);
                expect(item.prop("href")).toBe(stubItem.href);
            });

            expect(navItems.length).toBe(stubNavItems.length);
        });

        describe("renders required elements", () => {
            const {wrapper} = setup();

            test.each`
              name                          | qa
              ${"with logo"}                | ${"logo"}
              ${"with mobile-nav-toggle"}   | ${"mobile-nav-toggle"}
            `("$name", ({qa}) => {
                expect(getDataQA(wrapper, qa)).toBeDefined();
            });
        });
    });
});
