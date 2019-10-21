import * as React from "react";
import classNames from "classnames";
import { SimpleString } from "../renderers/simpleString";

interface Props {
  id?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  qa?: string;
  badge?: React.ReactNode;
}

type headerOptions = "h4"|"h3"|"h2"|"h1";

export const SectionContext = React.createContext<headerOptions>("h2");

const getNextHeader = (header: headerOptions) => {
  switch (header) {
    case "h1": return "h2";
    case "h2": return "h3";
    default: return "h4";
  }
};

const renderTitles = ({ title, subtitle, badge }: Props, isEmpty: boolean, header: headerOptions) => {
  // if nothing to render at top then we return null if there is a badge but no titles we still need to render the div with three quarters
  if (!title && !subtitle && !badge) return null;

  const Header = header;
  const headerClasses = classNames({
    "govuk-heading-xl" : header === "h1",
    "govuk-heading-l" : header === "h2",
    "govuk-heading-m" : header === "h3",
    "govuk-heading-s" : header === "h4",
    "govuk-!-margin-bottom-2": !!subtitle,
    "govuk-!-margin-bottom-0": !subtitle,
  });

  const classes = classNames({ "govuk-grid-column-full": !badge, "govuk-grid-column-three-quarters": !!badge, "govuk-!-margin-bottom-5" : !isEmpty }, );

  return (
    <div className={classes}>
      {!!title ? <Header className={headerClasses}>{title}</Header> : null}
      {!!subtitle ? <SimpleString>{subtitle}</SimpleString> : null}
    </div>
  );
};

const renderBadge = ({ badge }: Props) => !badge ? null : (<div className={classNames("govuk-grid-column-one-quarter", "govuk-!-margin-bottom-5")}>{badge}</div>);

const renderContents = (children: React.ReactNode) => !children ? null : (<div className="govuk-grid-column-full">{children}</div>);

export const Section: React.SFC<Props> = (props) => {
  const { title, subtitle, badge, id, children, qa } = props;
  const className = classNames({
    "govuk-grid-row": true,
    "acc-section": true
  });

  if (!title && !subtitle && !badge && !children) {
    return null;
  }

  return (
    <SectionContext.Consumer>
      {header => (
        <div id={id} className={className} data-qa={qa}>
          {renderTitles(props, !children, header)}
          {renderBadge(props)}
          <SectionContext.Provider value={!props.title ? header : getNextHeader(header)}>
            {renderContents(children)}
          </SectionContext.Provider>
        </div>
        )
      }
    </SectionContext.Consumer>
  );
};
