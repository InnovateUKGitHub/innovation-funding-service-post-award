import TestBed from "@shared/TestBed";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";
import { render } from "@testing-library/react";
import { Footer } from "@ui/components/layout/footer";
import { crownCopyrightUrl, footerLinks, ifsCookieUrl, ukGovLicence } from "@ui/containers/app/footer.config";

describe("Footer", () => {
  const stubContent = {
    site: {
      footer: {
        supportLinks: "stub-supportLinks",
        cookieFindOutMore: "stub-cookieFindOutMore",
        explainCookies: "stub-explainCookies",
        externalLinkText: "IFS PA is not available under the <0>MIT Licence</0>, except where otherwise stated",
        crownCopyright: "stub-crownCopyright",
      },
    },
  };

  const setup = () =>
    render(
      <TestBed>
        <Footer />
      </TestBed>,
    );

  beforeAll(async () => {
    testInitialiseInternationalisation(stubContent);
  });

  test("should render links", () => {
    const { queryByText } = setup();

    footerLinks.forEach(link => {
      expect(queryByText(link.content)).toBeInTheDocument();
    });
  });

  test.each`
    name               | linkContent
    ${"Support links"} | ${stubContent.site.footer.supportLinks}
  `("should find $name content", ({ linkContent }) => {
    const { queryByText } = setup();

    const footerContent = queryByText(linkContent);
    expect(footerContent).toBeInTheDocument();
  });

  test.each`
    name                    | text                                         | link
    ${"crown copyright"}    | ${stubContent.site.footer.crownCopyright}    | ${crownCopyrightUrl}
    ${"more about cookies"} | ${stubContent.site.footer.cookieFindOutMore} | ${ifsCookieUrl}
  `("should find $name link", ({ text, link }) => {
    const { queryByText } = setup();
    const footerContent = queryByText(text);

    if (!footerContent) throw Error(`It appears ${text} was not found in the document.`);

    expect(footerContent.getAttribute("href")).toBe(link);
    expect(footerContent).toBeInTheDocument();
  });

  test("should render OGLv3 text with link", () => {
    const { queryByTestId } = setup();
    const licenceContent = queryByTestId("licence");
    const licenceLink = queryByTestId("licence-link");

    if (!licenceLink) throw Error(`It appears the licence link was not found in the document.`);

    expect(licenceContent).toBeInTheDocument();
    expect(licenceLink).toBeInTheDocument();
    expect(licenceLink.getAttribute("href")).toBe(ukGovLicence);
    expect(licenceContent).toMatchSnapshot();
  });
});
