// tslint:disable: object-literal-key-quotes
import * as React from "react";
import { useContent } from "@ui/hooks";

export type LinkProps = React.AnchorHTMLAttributes<{}> & {
  "data-qa": string;
  text: string;
  href: string;
};

export type FooterLinks = LinkProps[];

export interface FooterExternalContent {
  "data-qa": LinkProps["data-qa"];
  href?: LinkProps["href"];
  children: string;
}

type RequiredContentLabels =
  | "title"
  | "usesCookie"
  | "govLicenseLinkPart1"
  | "govLicenseLinkPart3"
  | "crownCopyrightLink"
  | "moreAboutCookies"
  | "govLicenseLinkPart2";

// TODO: Requires a story to install + test using react-testing-library - prefer snapshot and capture only hardcoded properties
export const useExternalContent = (): {
  [key in RequiredContentLabels]: FooterExternalContent;
} => {
  const { getContent } = useContent();

  return {
    title: {
      "data-qa": "footer-title",
      children: getContent((x) => x.footer.supportLinks),
    },
    usesCookie: {
      "data-qa": "uses-cookies",
      children: getContent((x) => x.footer.explainCookies),
    },
    moreAboutCookies: {
      "data-qa": "more-about-cookies-text",
      href: "https://apply-for-innovation-funding.service.gov.uk/info/cookies",
      children: getContent((x) => x.footer.cookieFindOutMore),
    },
    govLicenseLinkPart1: {
      "data-qa": "govLicenseLinkPart1",
      children: getContent((x) => x.footer.govLicenseLinkPart1),
    },
    govLicenseLinkPart2: {
      "data-qa": "license-link",
      href:
        "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
      children: getContent((x) => x.footer.govLicenseLinkPart2),
    },
    govLicenseLinkPart3: {
      "data-qa": "govLicenseLinkPart3",
      children: getContent((x) => x.footer.govLicenseLinkPart3),
    },
    crownCopyrightLink: {
      "data-qa": "crown-copyright-link",
      href:
        "https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/",
      children: getContent((x) => x.footer.crownCopyright),
    },
  };
};
