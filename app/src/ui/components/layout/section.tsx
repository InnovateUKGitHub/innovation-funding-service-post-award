import * as React from "react";
import classNames from "classnames";
import { SimpleString } from "../renderers/simpleString";

interface Props {
  id?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  qa?: string;
  badge?: React.ReactNode;
  subsection?: boolean;
}

const renderTitles = ({ title, subtitle, badge, subsection }: Props) => {
  // if nothing to render at top then we return null if there is a badge but no titles we still need to render the div with three quarters
  if (!title && !subtitle && !badge) return null;

  const classes = classNames({ "govuk-grid-column-full": !badge, "govuk-grid-column-three-quarters": !!badge }, "govuk-!-margin-bottom-5");
  const Header =  subsection ? "h3" : "h2";
  const headerClasses = { "govuk-!-margin-bottom-2": !!subtitle, "govuk-heading-m": !subsection, "govuk-heading-s": !!subsection };

  return (
    <div className={classes}>
      {!!title ? <Header className={classNames(headerClasses)}>{title}</Header> : null}
      {!!subtitle ? <SimpleString>{subtitle}</SimpleString> : null}
    </div>
  );
};

const renderBadge = ({ badge }: Props) => !badge ? null : (<div className={classNames("govuk-grid-column-one-quarter", "govuk-!-margin-bottom-5")}>{badge}</div>);

const renderContents = (children: React.ReactNode) => !children ? null : (<div className="govuk-grid-column-full">{children}</div>);

export const Section: React.SFC<Props> = (props) => {
  const { title, subtitle, badge, id, children, qa } = props;

  if (!title && !subtitle && !badge && !children) {
    return null;
  }

  return (
    <div id={id} className={"govuk-grid-row govuk-!-margin-bottom-9 acc-section"} data-qa={qa}>
      {renderTitles(props)}
      {renderBadge(props)}
      {renderContents(children)}
    </div>
  );
};
