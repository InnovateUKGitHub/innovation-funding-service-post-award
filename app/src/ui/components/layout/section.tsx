import * as React from "react";
import classNames from "classnames";
import { SimpleString } from "../renderers";

interface Props {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  qa?: string;
  badge?: React.ReactNode;
}

const renderTitles = ({ title, subtitle, badge }: Props) => {
  // if nothing to render at top then we return null if there is a badge but no titles we still need to render the div with three quarters
  if (!title && !subtitle && !badge) {
    return null;
  }

  const className = classNames({ "govuk-grid-column-full": !badge, "govuk-grid-column-three-quarters": !!badge }, "govuk-!-margin-bottom-9");

  return (
    <div className={className}>
      {!!title ? <h2 className={classNames("govuk-heading-m", { "govuk-!-margin-bottom-2": !!subtitle })}>{title}</h2> : null}
      {!!subtitle ? <SimpleString>{subtitle}</SimpleString> : null}
    </div>
  );
};

const renderBadge = ({ badge }: Props) => {
  if (!badge) {
    return null
  }

  return (
    <div className={classNames("govuk-grid-column-one-quarter", "govuk-!-margin-bottom-9")}>{badge}</div>
  );
};

const renderContents = (children: React.ReactNode) => {
  if (!children) {
    return null
  }

  return (
    <div className="govuk-grid-column-full govuk-!-margin-bottom-9">{children}</div>
  );
};

export const Section: React.SFC<Props> = (props) => {
  const { title, subtitle, badge, children } = props;

  if (!title && !subtitle && !badge && !children) {
    return null;
  }

  return (
    <div className="govuk-grid-row" data-qa={props.qa}>
      {renderTitles(props)}
      {renderBadge(props)}
      {renderContents(children)}
    </div>
  );
};
