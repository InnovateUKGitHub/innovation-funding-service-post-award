import cx from "classnames";

import { IExternalAsLink, ISupplementLinksOptions } from "@ui/containers/app/footer.config";

import { H3, UL, GovWidthContainer, CrownCopyrightLogo } from "@ui/components";
import { ExternalLink, ExternalLinkProps } from "@ui/components/renderers";

export interface FooterProps {
  footerContent: ISupplementLinksOptions;
  supportingLinks: IExternalAsLink[];
}

export function Footer({ supportingLinks, footerContent }: FooterProps) {
  const { externalContent, externalLinks } = footerContent;

  return (
    <footer className="govuk-footer" role="contentinfo">
      <GovWidthContainer>
        <div className="govuk-footer__navigation">
          <div className="govuk-footer__section govuk-grid-column-two-thirds">
            <H3 as="h2" className="govuk-footer__heading">
              {externalContent.title.content}
            </H3>

            <ul className="govuk-footer__list govuk-footer__list--columns-2">
              {supportingLinks.map(({ content, ...linkProps }) => (
                <li key={linkProps.id} className="govuk-footer__list-item">
                  <FooterLink {...linkProps}>{content}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="govuk-footer__section-break" />

        <div className="govuk-footer__meta">
          <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
            <UL className="govuk-footer__inline-list">
              <li className="govuk-footer__inline-list-item" data-qa={externalContent.usesCookie.id}>
                {externalContent.usesCookie.content}
              </li>

              <li className="govuk-footer__inline-list-item">
                <FooterLink id={externalLinks.moreAboutCookies.id} href={externalLinks.moreAboutCookies.href}>
                  {externalLinks.moreAboutCookies.content}
                </FooterLink>
                .
              </li>
            </UL>

            <CrownCopyrightLogo
              className="govuk-footer__licence-logo"
              height="17"
              width="41"
              role="presentation"
              focusable="false"
            />

            <span className="govuk-footer__licence-description" data-qa="licence">
              <span data-qa={externalContent.govLicenseLinkPart1.id}>
                {externalContent.govLicenseLinkPart1.content}
              </span>

              <FooterLink
                rel="license"
                id={externalLinks.govLicenseLinkPart2.id}
                href={externalLinks.govLicenseLinkPart2.href}
              >
                {externalLinks.govLicenseLinkPart2.content}
              </FooterLink>

              <span data-qa={externalContent.govLicenseLinkPart3.id}>
                {externalContent.govLicenseLinkPart3.content}
              </span>
            </span>
          </div>
          <div className="govuk-footer__meta-item">
            <FooterLink
              className="govuk-footer__copyright-logo"
              id={externalLinks.crownCopyrightLink.id}
              href={externalLinks.crownCopyrightLink.href}
            >
              {externalLinks.crownCopyrightLink.content}
            </FooterLink>
          </div>
        </div>
      </GovWidthContainer>
    </footer>
  );
}

function FooterLink({ className, ...props }: ExternalLinkProps) {
  return <ExternalLink data-qa={props.id} className={cx("govuk-footer__link", className)} {...props} />;
}
