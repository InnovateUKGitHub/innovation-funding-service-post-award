import React, { useContext, createContext } from "react";
import cx from "classnames";
import { isContentSelector, useContent } from "@ui/hooks/content.hook";
import type { ContentSelector } from "@copy/type";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";
import { GdsHeadingTypes } from "../../atoms/Heading/Heading";
import { H1, H2, H3, H4 } from "../../atoms/Heading/Heading.variants";
export interface SectionProps {
  children?: React.ReactNode;
  id?: string;
  title?: string | React.ReactElement | ContentSelector;
  subtitle?: string | React.ReactElement | ContentSelector;
  qa?: string;
  badge?: React.ReactNode;
  className?: string;
}

type SectionTypes = Exclude<GdsHeadingTypes, "h1">;

export const sectionContext = createContext<SectionTypes>("h2");
export const SectionProvider = sectionContext.Provider;
const useSection = () => useContext(sectionContext);

/**
 * Section component
 */
export function Section({ id, qa, title, subtitle, badge, className, children }: SectionProps) {
  const { getContent } = useContent();
  const header = useSection();

  const hasNoTitlesOrBadge = !title && !subtitle && !badge;

  // Note: bail out if no content!
  if (hasNoTitlesOrBadge && !children) return null;

  const getNextHeader = () => {
    if (!title) return header;

    return header === "h2" ? "h3" : "h4";
  };

  const headingVariant = header.toUpperCase() as Uppercase<typeof header>;
  const Header = { H1, H2, H3, H4 }[headingVariant];

  return (
    <div
      id={id}
      data-qa={qa}
      className={cx(className, "govuk-grid-row", "acc-section", {
        "govuk-!-margin-bottom-6": header !== "h4",
      })}
    >
      {!hasNoTitlesOrBadge && (
        <div
          className={cx({
            "govuk-grid-column-full": !badge,
            "govuk-grid-column-three-quarters": !!badge,
            "govuk-!-margin-bottom-5": children,
          })}
        >
          {title && (
            <Header
              data-qa="section-title"
              className={cx({
                "govuk-!-margin-bottom-2": !!subtitle,
                "govuk-!-margin-bottom-0": !subtitle,
              })}
            >
              {isContentSelector(title) ? getContent(title) : title}
            </Header>
          )}

          {subtitle && (
            <SimpleString qa="section-subtitle">
              {isContentSelector(subtitle) ? getContent(subtitle) : subtitle}
            </SimpleString>
          )}
        </div>
      )}

      {badge && (
        <div data-qa="section-badge" className="govuk-grid-column-one-quarter govuk-!-margin-bottom-5">
          {badge}
        </div>
      )}

      {children && (
        <SectionProvider value={getNextHeader()}>
          <div data-qa="section-content" className="govuk-grid-column-full">
            {children}
          </div>
        </SectionProvider>
      )}
    </div>
  );
}
