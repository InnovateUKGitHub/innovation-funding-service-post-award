import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { CrownCopyrightLogo } from "@ui/components/atomicDesign/atoms/svg/CrownCopyrightLogo/crownCopyrightLogo";
import { GovWidthContainer } from "@ui/components/atomicDesign/atoms/GovWidthContainer/GovWidthContainer";
import { UL } from "@ui/components/atomicDesign/atoms/List/list";
import { ExternalLinkProps, ExternalLink } from "@ui/components/atomicDesign/atoms/ExternalLink/externalLink";
import { H3 } from "@ui/components/atomicDesign/atoms/Heading/Heading.variants";
import { crownCopyrightUrl, footerLinks, ifsCookieUrl, ukGovLicence } from "@ui/containers/app/footer.config";
import { useContent } from "@ui/hooks/content.hook";
import cx from "classnames";

const Footer = () => {
  const { getContent } = useContent();

  return (
    <footer className="govuk-footer" role="contentinfo">
      <GovWidthContainer>
        <div className="govuk-footer__navigation">
          <div className="govuk-footer__section govuk-grid-column-two-thirds">
            <H3 as="h2" className="govuk-footer__heading">
              {getContent(x => x.site.footer.supportLinks)}
            </H3>

            <ul className="govuk-footer__list govuk-footer__list--columns-2">
              {footerLinks.map(({ content, ...linkProps }) => (
                <li key={linkProps.id} className="govuk-footer__list-item">
                  <FooterLink {...linkProps}>{getContent(content)}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="govuk-footer__section-break" />

        <div className="govuk-footer__meta">
          <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
            <UL className="govuk-footer__inline-list">
              <li className="govuk-footer__inline-list-item">{getContent(x => x.site.footer.explainCookies)}</li>

              <li className="govuk-footer__inline-list-item">
                <FooterLink href={ifsCookieUrl}>{getContent(x => x.site.footer.cookieFindOutMore)}</FooterLink>.
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
              <Content
                components={[
                  <FooterLink key="licence" data-qa="licence-link" rel="license" href={ukGovLicence}>
                    {" "}
                    {/* react-i18next will auto-magically fill in the gap. */}
                  </FooterLink>,
                ]}
                value={x => x.site.footer.externalLinkText}
              />
            </span>
          </div>
          <div className="govuk-footer__meta-item">
            <FooterLink className="govuk-footer__copyright-logo" href={crownCopyrightUrl}>
              {getContent(x => x.site.footer.crownCopyright)}
            </FooterLink>
          </div>
        </div>
      </GovWidthContainer>
    </footer>
  );
};

const FooterLink = ({ className, ...props }: ExternalLinkProps) => {
  return <ExternalLink data-qa={props.id} className={cx("govuk-footer__link", className)} {...props} />;
};

export { Footer };
