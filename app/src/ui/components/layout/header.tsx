import { useMemo } from "react";
import { useContent, useGovFrontend } from "@ui/hooks";
import { useStores } from "@ui/redux";

import { GovWidthContainer } from "./GovWidthContainer";
import { Logo } from "./Logo";

export interface HeaderProps {
  headingLink: string;
  showMenu?: boolean;
}

export function Header({ showMenu = true, headingLink }: HeaderProps) {
  const stores = useStores();
  const { getContent, content } = useContent();
  const { setRef } = useGovFrontend("Header");

  const config = stores.config.getConfig();

  const menuItems = useMemo(
    () =>
      showMenu
        ? [
            {
              qa: "nav-dashboard",
              href: `${config.ifsRoot}/dashboard-selection`,
              text: getContent(x => x.header.dashboard),
            },
            {
              qa: "nav-profile",
              href: `${config.ifsRoot}/profile/view`,
              text: getContent(x => x.header.profile),
            },
            {
              qa: "nav-sign-out",
              href: "/logout",
              text: getContent(x => x.header.signOut),
            },
          ]
        : [],
    [showMenu, config.ifsRoot, getContent],
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
            {content.header.siteName}
          </a>

          <nav aria-label="Menu" className="govuk-header__navigation">
            <button
              type="button"
              className="govuk-header__menu-button govuk-js-header-toggle"
              aria-controls="navigation"
              aria-label="Show or hide Top Level Navigation"
              data-qa="mobile-nav-toggle"
            >
              {getContent(x => x.header.mobileNavigationLabel)}
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
}
