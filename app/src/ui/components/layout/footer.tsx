import * as React from "react";

// tslint:disable-next-line: max-line-length
const path = "M421.5 142.8V.1l-50.7 32.3v161.1h112.4v-50.7zm-122.3-9.6A47.12 47.12 0 0 1 221 97.8c0-26 21.1-47.1 47.1-47.1 16.7 0 31.4 8.7 39.7 21.8l42.7-27.2A97.63 97.63 0 0 0 268.1 0c-36.5 0-68.3 20.1-85.1 49.7A98 98 0 0 0 97.8 0C43.9 0 0 43.9 0 97.8s43.9 97.8 97.8 97.8c36.5 0 68.3-20.1 85.1-49.7a97.76 97.76 0 0 0 149.6 25.4l19.4 22.2h3v-87.8h-80l24.3 27.5zM97.8 145c-26 0-47.1-21.1-47.1-47.1s21.1-47.1 47.1-47.1 47.2 21 47.2 47S123.8 145 97.8 145";

interface Link {
  link: string;
  text: string;
}

const createLink = (text: string, link: string): Link => ({ link, text });

const links: Link[] = [
  createLink("Innovate UK", "https://www.gov.uk/government/organisations/innovate-uk"),
  createLink("Innovation funding advice", "https://www.gov.uk/guidance/innovation-apply-for-a-funding-award"),
  createLink("Connect to innovation experts", "https://www.gov.uk/guidance/innovation-get-support-and-advice"),
  createLink("Events", "https://connect.innovateuk.org/events"),
  createLink("Innovate UK blog", "https://innovateuk.blog.gov.uk/"),
  createLink("GOV.UK accessibility", "https://www.gov.uk/help/accessibility"),
  createLink("Terms and conditions", "https://apply-for-innovation-funding.service.gov.uk/info/terms-and-conditions"),
  createLink("Contact us", "https://apply-for-innovation-funding.service.gov.uk/info/contact"),
  createLink("Sign up for competition updates", "http://info.innovateuk.org/emailpref"),
  createLink("Latest funding opportunities", "https://apply-for-innovation-funding.service.gov.uk/competition/search")
];

export const Footer: React.FunctionComponent<{}> = () => {
  const renderLinks = (l: Link, i: number) => (
    <li key={i} className="govuk-footer__inline-list-item">
      <a className="govuk-footer__link" target="_blank" data-qa={l.text.split(" ").join("-").toLocaleLowerCase()} href={l.link}>{l.text}</a>
    </li>
  );

  return (
    <footer className="govuk-footer" role="contentinfo" data-qa="pageFooter">
      <div className="govuk-width-container ">
        <div className="govuk-footer__meta">
          <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
            <h2 className="govuk-visually-hidden">Support links</h2>
            <ul className="govuk-footer__inline-list">
              {links.map(renderLinks)}
            </ul>
            <ul className="govuk-footer__inline-list">
              <li className="govuk-footer__inline-list-item" data-qa="uses-cokies">
                GOV.UK uses cookies to make the site simpler.
              </li>
              <li className="govuk-footer__inline-list-item">
                <a className="govuk-footer__link" href="https://apply-for-innovation-funding.service.gov.uk/info/cookies" data-qa="more-about-cokies-text">
                  Find out more about cookies
                </a>.
              </li>
            </ul>
            <svg role="presentation" focusable="false" className="govuk-footer__licence-logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 483.2 195.7" height="17" width="41">
              <path fill="currentColor" d={path} />
            </svg>
            <span className="govuk-footer__licence-description" data-qa="licence">
              All content is available under the <a className="govuk-footer__link" href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/" rel="license" data-qa="license-link">Open Government Licence v3.0</a>, except where otherwise stated
            </span>
          </div>
          <div className="govuk-footer__meta-item">
            <a className="govuk-footer__link govuk-footer__copyright-logo" href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/">© Crown copyright</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
