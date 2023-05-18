import { ContentSelector } from "@copy/type";

export interface IExternalAsLink {
  href: string;
  id: string;
  content: ContentSelector;
}

export const footerLinks: IExternalAsLink[] = [
  {
    id: "innovate-uk",
    href: "https://www.gov.uk/government/organisations/innovate-uk",
    content: x => x.site.footer.innovateUk,
  },
  {
    id: "innovation-funding-advice",
    href: "https://www.gov.uk/guidance/innovation-apply-for-a-funding-award",
    content: x => x.site.footer.innovationFundingAdvice,
  },
  {
    id: "connect-to-innovation-experts",
    href: "https://www.gov.uk/guidance/innovation-get-support-and-advice",
    content: x => x.site.footer.connectToInnovationExperts,
  },
  {
    id: "events",
    href: "https://connect.innovateuk.org/events",
    content: x => x.site.footer.events,
  },
  {
    id: "innovate-uk-blog",
    href: "https://innovateuk.blog.gov.uk/",
    content: x => x.site.footer.innovateUkBlog,
  },
  {
    id: "gov.uk-accessibility",
    href: "https://www.gov.uk/help/accessibility",
    content: x => x.site.footer.govAccessibility,
  },
  {
    id: "terms-and-conditions",
    href: "https://apply-for-innovation-funding.service.gov.uk/info/terms-and-conditions",
    content: x => x.site.footer.termsAndConditions,
  },
  {
    id: "contact-us",
    href: "https://apply-for-innovation-funding.service.gov.uk/info/contact",
    content: x => x.site.footer.contactUs,
  },
  {
    id: "sign-up-for-competition-updates",
    href: "http://info.innovateuk.org/emailpref",
    content: x => x.site.footer.signUpForCompetitionUpdates,
  },
  {
    id: "latest-funding-opportunities",
    href: "https://apply-for-innovation-funding.service.gov.uk/competition/search",
    content: x => x.site.footer.latestFundingOpportunities,
  },
];

export const crownCopyrightUrl =
  "https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/";
export const ifsCookieUrl = "https://apply-for-innovation-funding.service.gov.uk/info/cookies";
export const ukGovLicence = "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/";
