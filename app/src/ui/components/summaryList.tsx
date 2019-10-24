import React from "react";
import cn from "classnames";

interface ListProps {
  noBorders?: boolean;
  qa: string;
  heading?: React.ReactNode;
}

interface ItemProps {
  label: React.ReactNode;
  content: React.ReactNode;
  action?: React.ReactNode;
  qa: string;
}
export const SummaryList: React.FunctionComponent<ListProps> = (props) => {
  const classNames = cn({
    "govuk-summary-list": true,
    "govuk-summary-list--no-border": props.noBorders
  });

  const headerNames = cn({
    "govuk-fieldset": true,
    "govuk-fieldset__legend": true,
    "govuk-fieldset__legend--m": true
  });

  const Header = "h2";

  return (
    <React.Fragment>
      <legend className={headerNames}>
        {props.heading ? <Header className="govuk-fieldset__heading">{props.heading}</Header> : null}
      </legend>
      <dl className={classNames} data-qa={props.qa}>
        {props.children}
      </dl>
    </React.Fragment>
  );
};

export const SummaryListItem: React.FunctionComponent<ItemProps> = (props) => {

  return (
    <div className="govuk-summary-list__row" data-qa={props.qa}>
      <dt className="govuk-summary-list__key">{props.label}</dt>
      <dd className="govuk-summary-list__value">{props.content}</dd>
      <dd className="govuk-summary-list__actions">
        {props.action}
      </dd>
    </div>
  );
};
