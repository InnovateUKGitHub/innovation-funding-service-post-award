import { useMemo } from "react";
import { useContent, useGovFrontend } from "@ui/hooks";

import { GovWidthContainer } from "./GovWidthContainer";
import { Logo } from "./Logo";
import { useClientOptionsQuery } from "@gql/hooks/useSiteOptionsQuery";

export interface HeaderProps {
  headingLink: string;
  showMenu?: boolean;
}

export const Header = ({ showMenu = true, headingLink }: HeaderProps) => {
  const { getContent } = useContent();
  const { setRef } = useGovFrontend("Header");

  const { data } = useClientOptionsQuery();

  const menuItems = useMemo(
    () =>
      showMenu
        ? [
            {
              qa: "nav-dashboard",
              href: `${data.clientConfig.ifsRoot}/dashboard-selection`,
              text: getContent(x => x.site.header.navigation.dashboard),
            },
            {
              qa: "nav-profile",
              href: `${data.clientConfig.ifsRoot}/profile/view`,
              text: getContent(x => x.site.header.navigation.profile),
            },
            {
              qa: "nav-sign-out",
              href: "/logout",
              text: getContent(x => x.site.header.navigation.signOut),
            },
          ]
        : [],
    [showMenu, data, getContent],
  );

  return (
    <header className="govuk-header" role="banner" data-module="header" data-qa="pageHeader" ref={setRef}>
      <GovWidthContainer className="govuk-header__container">
        <div className="govuk-header__logo">
          <a href="https://www.gov.uk" className="govuk-header__link govuk-header__link--homepage">
            <Logo />
          </a>
        </div>

        <div className="govuk-header__content">
          <a href={headingLink} className="govuk-header__link govuk-header__link--service-name" data-qa="site-name">
            {getContent(x => x.site.header.siteName)}
          </a>

          <nav aria-label="Menu" className="govuk-header__navigation">
            <button
              type="button"
              className="govuk-header__menu-button govuk-js-header-toggle"
              aria-controls="navigation"
              aria-label="Show or hide Top Level Navigation"
              data-qa="mobile-nav-toggle"
            >
              {getContent(x => x.site.header.mobileNavigationLabel)}
            </button>

            <ul id="navigation" className="govuk-header__navigation-list">
              {menuItems.map(({ text, qa, ...props }) => (
                <li key={text} className="govuk-header__navigation-item" data-qa="header-navigation-item">
                  <a {...props} className="govuk-header__link" data-qa={qa}>
                    {text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </GovWidthContainer>
    </header>
  );
};
