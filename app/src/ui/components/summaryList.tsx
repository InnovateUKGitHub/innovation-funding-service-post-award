import React from "react";
import cn from "classnames";

interface ListProps {
  noBorders?: boolean;
}

interface ItemProps {
  label: React.ReactNode;
  content: React.ReactNode;
  action?: React.ReactNode;
}
export const SummaryList: React.FunctionComponent<ListProps> = (props) => {
  const classNames = cn({
    "govuk-summary-list": true,
    "govuk-summary-list--no-border": props.noBorders
  });

  return (
    <dl className={classNames}>
      {props.children}
    </dl>
  );
};

export const SummaryListItem: React.FunctionComponent<ItemProps> = (props) => {

  return (
    <div className="govuk-summary-list__row">
      <dt className="govuk-summary-list__key">{props.label}</dt>
      <dd className="govuk-summary-list__value">{props.content}</dd>
      <dd className="govuk-summary-list__actions">
        {props.action}
      </dd>
    </div>
  );
};
