import { render } from "@testing-library/react";

import { Footer, FooterProps } from "@ui/components/layout/footer";

describe("Footer", () => {
  const stubData: FooterProps = {
    supportingLinks: [
      {
        id: "link-1",
        href: "https://www.gov.uk/link-1",
        content: "supporting-link-1",
      },
      {
        id: "link-2",
        href: "https://www.gov.uk/link-2",
        content: "supporting-link-2",
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

  const setup = (props?: Partial<FooterProps>) => render(<Footer {...stubData} {...props} />);

  test("should render links", () => {
    const { queryByText } = setup();

    stubData.supportingLinks.forEach(link => {
      expect(queryByText(link.content)).toBeInTheDocument();
    });
  });

  test.each`
    name                                         | linkContent
    ${"title"}                                   | ${stubData.footerContent.externalContent.title.content}
    ${"GOV.UK uses cookies"}                     | ${stubData.footerContent.externalContent.usesCookie.content}
    ${"external government license link part 1"} | ${stubData.footerContent.externalContent.govLicenseLinkPart1.content}
    ${"external government license link part 3"} | ${stubData.footerContent.externalContent.govLicenseLinkPart3.content}
  `("should find $name content", ({ linkContent }) => {
    const { queryByText } = setup();

    const footerContent = queryByText(linkContent);
    expect(footerContent).toBeInTheDocument();
  });

  test.each`
    name                                    | link
    ${"crown copyright"}                    | ${stubData.footerContent.externalLinks.crownCopyrightLink}
    ${"more about cookies"}                 | ${stubData.footerContent.externalLinks.moreAboutCookies}
    ${"external government license part 2"} | ${stubData.footerContent.externalLinks.govLicenseLinkPart2}
  `("should find $name link", ({ link }) => {
    const { queryByText } = setup();
    const footerContent = queryByText(link.content);

    if (!footerContent) throw Error(`It appears ${link} was not found in the document.`);

    expect(footerContent.getAttribute("href")).toBe(link.href);
    expect(footerContent).toBeInTheDocument();
  });
});
