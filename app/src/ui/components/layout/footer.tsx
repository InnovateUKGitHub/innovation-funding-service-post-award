import React from "react";
import cx from "classnames";
import { UL } from "@ui/components/layout/list";
import { ExternalLink } from "../renderers";
import { GovWidthContainer } from "./GovWidthContainer";
import { CrownCopyrightLogo } from "./crownCopyrightLogo";

import { FooterLinks, useExternalContent } from "./footer.config";

export interface FooterProps {
  links: FooterLinks;
}

export const Footer = ({ links }: FooterProps) => {
  const content = useExternalContent();
  const footerLinks = links.map(({ text, ...linkProps }) => (
    <li key={text} className="govuk-footer__inline-list-item">
      <FooterLink {...linkProps}>{text}</FooterLink>
    </li>
  ));

  return (
    <footer className="govuk-footer" role="contentinfo" data-qa="pageFooter">
      <GovWidthContainer>
        <div className="govuk-footer__meta">
          <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
            <h2 className="govuk-visually-hidden" {...content.title}>{content.title.children}</h2>

            <UL className="govuk-footer__inline-list">{footerLinks}</UL>

            <UL className="govuk-footer__inline-list">
              <li className="govuk-footer__inline-list-item" {...content.usesCookie} />
              <li className="govuk-footer__inline-list-item">
                <FooterLink {...content.moreAboutCookies} />.
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
              <span {...content.govLicenseLinkPart1} />
              <FooterLink rel="license" {...content.govLicenseLinkPart2} />
              <span {...content.govLicenseLinkPart3} />
            </span>
          </div>

          <div className="govuk-footer__meta-item">
            <FooterLink className="govuk-footer__copyright-logo" {...content.crownCopyrightLink} />
          </div>
        </div>
      </GovWidthContainer>
    </footer>
  );
};

// TODO: this typing issue needs to be addressed
function FooterLink({ className, ...props }: any) {
  return <ExternalLink className={cx("govuk-footer__link", className)} {...props} />;
}
