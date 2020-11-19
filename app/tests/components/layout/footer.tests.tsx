// tslint:disable: object-literal-key-quotes
import React from "react";
// tslint:disable-next-line: import-blacklist
import { mount } from "enzyme";
import { Footer, FooterProps } from "@ui/components/layout/footer";
import * as footerConfig from "@ui/components/layout/footer.config";

import { findByQa } from "../helpers/find-by-qa";

describe("Footer", () => {
  const stubDataContext = {
    title: {
      "data-qa": "stub-qa-title",
      children: "stub-title",
    },
    usesCookie: {
      "data-qa": "stub-qa-usesCookie",
      children: "stub-usesCookie",
    },
    crownCopyrightLink: {
      "data-qa": "stub-qa-crownCopyrightLink",
      href: "stub-href-crownCopyrightLink",
      children: "stub-crownCopyrightLink",
    },
    moreAboutCookies: {
      "data-qa": "stub-qa-moreAboutCookies",
      href: "stub-href-moreAboutCookies",
      children: "stub-moreAboutCookies",
    },
    govLicenseLinkPart1: {
      "data-qa": "stub-qa-govLicenseLinkPart1",
      children: "stub-govLicenseLinkPart1",
    },
    govLicenseLinkPart2: {
      "data-qa": "stub-qa-govLicenseLinkPart2",
      href: "stub-href-govLicenseLinkPart2",
      children: "stub-govLicenseLinkPart2",
    },
    govLicenseLinkPart3: {
      "data-qa": "stub-qa-govLicenseLinkPart3",
      children: "stub-govLicenseLinkPart3",
    },
  };

  beforeEach(() => {
    jest
      .spyOn(footerConfig, "useExternalContent")
      .mockReturnValue(stubDataContext as any);
  });

  const stubLinks: footerConfig.FooterLinks = [
    {
      "data-qa": "link-1",
      text: "Link 1",
      href: "https://www.gov.uk/link-1",
    },
    {
      "data-qa": "link-2",
      text: "Link 2",
      href: "https://www.gov.uk/link-2",
    },
  ];

  const setup = (props?: FooterProps) =>
    mount(<Footer links={stubLinks} {...props} />);

  it("should render links", () => {
    const wrapper = setup();

    stubLinks.forEach((stubLink) => {
      // Note: get link by qa then grab item by array index
      const footerLink = findByQa(wrapper, stubLink["data-qa"]);
      expect(footerLink.text()).toBe(stubLink.text);
    });
  });

  test.each`
    name                                         | link
    ${"title"}                                   | ${stubDataContext.title}
    ${"GOV.UK uses cookies"}                     | ${stubDataContext.usesCookie}
    ${"external government license link part 1"} | ${stubDataContext.govLicenseLinkPart1}
    ${"external government license link part 3"} | ${stubDataContext.govLicenseLinkPart3}
  `("should find $name content", ({ link }) => {
    const wrapper = setup();

    const footerContent = findByQa(wrapper, link["data-qa"]);
    expect(footerContent.text()).toBe(link.children);
  });

  test.each`
    name                                    | link
    ${"crown copyright"}                    | ${stubDataContext.crownCopyrightLink}
    ${"more about cookies"}                 | ${stubDataContext.moreAboutCookies}
    ${"external government license part 2"} | ${stubDataContext.govLicenseLinkPart2}
  `("should find $name link", ({ link }) => {
    const wrapper = setup();

    const footerLink = findByQa(wrapper, link["data-qa"]);
    expect(footerLink.text()).toBe(link.children);
    expect(footerLink.prop("href")).toBe(link.href);
  });
});
