import React from "react";
import classNames from "classnames";
import { ContentSelector } from "@content/content";
import { SimpleString } from "../renderers/simpleString";
import { Content } from "../content";
import { GdsHeadingTypes } from "../typography";

export interface SectionProps {
  children?: React.ReactNode;
  id?: string;
  title?: React.ReactNode;
  titleContent?: ContentSelector;
  subtitle?: React.ReactNode;
  subtitleContent?: ContentSelector;
  qa?: string;
  badge?: React.ReactNode;
  className?: string;
}

export const SectionContext = React.createContext<GdsHeadingTypes>("h2");

const getNextHeader = (header: GdsHeadingTypes) => {
  switch (header) {
    case "h1":
      return "h2";
    case "h2":
      return "h3";
    default:
      return "h4";
  }
};

const renderTitles = (
  { title, titleContent, subtitle, subtitleContent, badge }: SectionProps,
  isEmpty: boolean,
  header: GdsHeadingTypes,
) => {
  // if nothing to render at top then we return null if there is a badge but no titles we still need to render the div with three quarters
  if (!title && !titleContent && !subtitle && !subtitleContent && !badge) return null;

  const Header = header;
  const headerClasses = classNames({
    "acc-section-title": true,
    "govuk-heading-xl": header === "h1",
    "govuk-heading-l": header === "h2",
    "govuk-heading-m": header === "h3",
    "govuk-heading-s": header === "h4",
    "govuk-!-margin-bottom-2": !!subtitle,
    "govuk-!-margin-bottom-0": !subtitle,
  });

  const classes = classNames({
    "govuk-grid-column-full": !badge,
    "govuk-grid-column-three-quarters": !!badge,
    "govuk-!-margin-bottom-5": !isEmpty,
  });

  return (
    <div className={classes}>
      {!!title || !!titleContent ? (
        <Header className={headerClasses}>{titleContent ? <Content value={titleContent} /> : title}</Header>
      ) : null}
      {!!subtitle || subtitleContent ? (
        <SimpleString className="acc-section-subtitle">
          {subtitleContent ? <Content value={subtitleContent} /> : subtitle}
        </SimpleString>
      ) : null}
    </div>
  );
};

const renderBadge = ({ badge }: SectionProps) =>
  !badge ? null : <div className={classNames("govuk-grid-column-one-quarter", "govuk-!-margin-bottom-5")}>{badge}</div>;

const renderContents = (children: React.ReactNode) =>
  !children ? null : <div className="govuk-grid-column-full">{children}</div>;

export function Section(props: SectionProps) {
  const { title, titleContent, subtitle, badge, id, children, qa, className } = props;

  // Note: bail if no content!
  if (!title && !titleContent && !subtitle && !badge && !children) return null;

  return (
    <SectionContext.Consumer>
      {header => (
        <div
          id={id}
          className={classNames(
            "govuk-grid-row",
            "acc-section",
            {
              "govuk-!-margin-bottom-6": header === "h2" || header === "h3",
            },
            className,
          )}
          data-qa={qa}
        >
          {renderTitles(props, !children, header)}

          {renderBadge(props)}

          <SectionContext.Provider value={!title && !titleContent ? header : getNextHeader(header)}>
            {renderContents(children)}
          </SectionContext.Provider>
        </div>
      )}
    </SectionContext.Consumer>
  );
}
