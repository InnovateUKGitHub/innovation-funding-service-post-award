import { useContent, useGovFrontend } from "@ui/hooks";
import { UL } from "@ui/components/layout/list";

import { GovWidthContainer } from "./GovWidthContainer";
import { Logo } from "./Logo";

interface NavigationItem {
  text: string;
  qa: string;
  href: string;
}

export interface HeaderProps {
  headingLink: string;
  menuItems?: NavigationItem[];
}

export function Header({ headingLink, menuItems }: HeaderProps) {
  const { getContent, content } = useContent();
  const { setRef } = useGovFrontend("Header");

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

          <button
            type="button"
            className="govuk-header__menu-button govuk-js-header-toggle"
            aria-controls="navigation"
            aria-label="Show or hide Top Level Navigation"
            data-qa="mobile-nav-toggle"
          >
            {getContent(x => x.header.mobileNavigationLabel)}
          </button>

          {!!menuItems?.length && (
            <nav>
              <UL
                id="navigation"
                className="govuk-header__navigation"
                aria-label="Top Level Navigation"
                data-qa="header-navigation"
                aria-hidden={false}
              >
                {menuItems.map(({ text, qa, ...props }) => (
                  <li key={text} className="govuk-header__navigation-item" data-qa="header-navigation-item">
                    <a {...props} className="govuk-header__link" data-qa={qa}>
                      {text}
                    </a>
                  </li>
                ))}
              </UL>
            </nav>
          )}
        </div>
      </GovWidthContainer>
    </header>
  );
}
