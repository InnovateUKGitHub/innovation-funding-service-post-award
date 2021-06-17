import { mount } from "enzyme";
import { Footer, FooterProps } from "@ui/components/layout/footer";

import { findByQa } from "../helpers/find-by-qa";

describe("Footer", () => {
  const stubData: FooterProps = {
    supportingLinks: [
      {
        id: "link-1",
        href: "https://www.gov.uk/link-1",
        content: "Link 1",
      },
      {
        id: "link-2",
        href: "https://www.gov.uk/link-2",
        content: "Link 2",
      },
    ],
    footerContent: {
      externalContent: {
        title: {
          id: "stub-qa-title",
          content: "stub-title",
        },
        usesCookie: {
          id: "stub-qa-usesCookie",
          content: "stub-usesCookie",
        },
        govLicenseLinkPart1: {
          id: "stub-qa-govLicenseLinkPart1",
          content: "stub-govLicenseLinkPart1",
        },
        govLicenseLinkPart3: {
          id: "stub-qa-govLicenseLinkPart3",
          content: "stub-govLicenseLinkPart3",
        },
      },
      externalLinks: {
        crownCopyrightLink: {
          id: "stub-qa-crownCopyrightLink",
          href: "stub-href-crownCopyrightLink",
          content: "stub-crownCopyrightLink",
        },
        moreAboutCookies: {
          id: "stub-qa-moreAboutCookies",
          href: "stub-href-moreAboutCookies",
          content: "stub-moreAboutCookies",
        },
        govLicenseLinkPart2: {
          id: "stub-qa-govLicenseLinkPart2",
          href: "stub-href-govLicenseLinkPart2",
          content: "stub-govLicenseLinkPart2",
        },
      },
    },
  };

  const setup = (props?: Partial<FooterProps>) => mount(<Footer {...stubData} {...props} />);

  test("should render links", () => {
    const wrapper = setup();

    stubData.supportingLinks.forEach(stubLink => {
      // Note: get link by qa then grab item by array index
      const footerLink = findByQa(wrapper, stubLink.id);
      expect(footerLink.text()).toBe(stubLink.content);
    });
  });

  test.each`
    name                                         | link
    ${"title"}                                   | ${stubData.footerContent.externalContent.title}
    ${"GOV.UK uses cookies"}                     | ${stubData.footerContent.externalContent.usesCookie}
    ${"external government license link part 1"} | ${stubData.footerContent.externalContent.govLicenseLinkPart1}
    ${"external government license link part 3"} | ${stubData.footerContent.externalContent.govLicenseLinkPart3}
  `("should find $name content", ({ link }) => {
    const wrapper = setup();

    const footerContent = findByQa(wrapper, link.id);
    expect(footerContent.text()).toBe(link.content);
  });

  test.each`
    name                                    | link
    ${"crown copyright"}                    | ${stubData.footerContent.externalLinks.crownCopyrightLink}
    ${"more about cookies"}                 | ${stubData.footerContent.externalLinks.moreAboutCookies}
    ${"external government license part 2"} | ${stubData.footerContent.externalLinks.govLicenseLinkPart2}
  `("should find $name link", ({ link }) => {
    const wrapper = setup();

    const footerLink = findByQa(wrapper, link.id);

    expect(footerLink.text()).toBe(link.content);
    expect(footerLink.prop("href")).toBe(link.href);
  });
});
