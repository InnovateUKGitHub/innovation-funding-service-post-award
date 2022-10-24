import { useContent } from "@ui/hooks";

export interface IExternalAsLink {
  href: string;
  id: string;
  content: string;
}

interface IExternalAsContent {
  id: string;
  content: string;
}

export const footerLinks: IExternalAsLink[] = [
  {
    id: "innovate-uk",
    href: "https://www.gov.uk/government/organisations/innovate-uk",
    content: "Innovate UK",
  },
  {
    id: "innovation-funding-advice",
    href: "https://www.gov.uk/guidance/innovation-apply-for-a-funding-award",
    content: "Innovation funding advice",
  },
  {
    id: "connect-to-innovation-experts",
    href: "https://www.gov.uk/guidance/innovation-get-support-and-advice",
    content: "Connect to innovation experts",
  },
  {
    id: "events",
    href: "https://connect.innovateuk.org/events",
    content: "Events",
  },
  {
    id: "innovate-uk-blog",
    href: "https://innovateuk.blog.gov.uk/",
    content: "Innovate UK blog",
  },
  {
    id: "gov.uk-accessibility",
    href: "https://www.gov.uk/help/accessibility",
    content: "GOV.UK accessibility",
  },
  {
    id: "terms-and-conditions",
    href: "https://apply-for-innovation-funding.service.gov.uk/info/terms-and-conditions",
    content: "Terms and conditions",
  },
  {
    id: "contact-us",
    href: "https://apply-for-innovation-funding.service.gov.uk/info/contact",
    content: "Contact us",
  },
  {
    id: "sign-up-for-competition-updates",
    href: "http://info.innovateuk.org/emailpref",
    content: "Sign up for competition updates",
  },
  {
    id: "latest-funding-opportunities",
    href: "https://apply-for-innovation-funding.service.gov.uk/competition/search",
    content: "Latest funding opportunities",
  },
];

export interface ISupplementLinksOptions {
  externalContent: Record<"title" | "usesCookie" | "govLicenseLinkPart1" | "govLicenseLinkPart3", IExternalAsContent>;
  externalLinks: Record<"crownCopyrightLink" | "moreAboutCookies" | "govLicenseLinkPart2", IExternalAsLink>;
}

export const useFooterExternalContent = (): ISupplementLinksOptions => {
  const { getContent } = useContent();

  const crownCopyrightUrl =
    "https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/";
  const ifsCookieUrl = "https://apply-for-innovation-funding.service.gov.uk/info/cookies";
  const ukGovLicence = "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/";

  return {
    externalContent: {
      title: {
        id: "footer-title",
        content: getContent(x => x.site.footer.supportLinks),
      },
      usesCookie: {
        id: "uses-cookies",
        content: getContent(x => x.site.footer.explainCookies),
      },

      govLicenseLinkPart1: {
        id: "govLicenseLinkPart1",
        content: getContent(x => x.site.footer.externalLinkText.part1),
      },

      govLicenseLinkPart3: {
        id: "govLicenseLinkPart3",
        content: getContent(x => x.site.footer.externalLinkText.part2),
      },
    },
    externalLinks: {
      moreAboutCookies: {
        id: "more-about-cookies-text",
        href: ifsCookieUrl,
        content: getContent(x => x.site.footer.cookieFindOutMore),
      },
      crownCopyrightLink: {
        id: "crown-copyright-link",
        href: crownCopyrightUrl,
        content: getContent(x => x.site.footer.crownCopyright),
      },
      govLicenseLinkPart2: {
        id: "license-link",
        href: ukGovLicence,
        content: getContent(x => x.site.footer.externalLinkText.part2LinkText),
      },
    },
  };
};

/**
 *
 * @deprecated This needs to be replaced with the direct usage of hook useFooterExternalContent()
 */
export function FooterExternalContent({
  children,
}: {
  children: (content: ISupplementLinksOptions) => React.ReactElement;
}) {
  const content = useFooterExternalContent();

  return children(content);
}
