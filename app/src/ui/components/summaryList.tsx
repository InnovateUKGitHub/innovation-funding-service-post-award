import React from "react";
import cn from "classnames";
import { Result } from "@ui/validation";
import { ContentSelector } from "@content/content";
import { Content } from "./content";

interface ListProps {
  noBorders?: boolean;
  qa: string;
}

interface ItemProps {
  label?: React.ReactNode;
  labelContent?: ContentSelector;
  content: React.ReactNode;
  action?: React.ReactNode;
  hideAction?: boolean;
  validation?: Result;
  qa: string;
}

export const SummaryList: React.FunctionComponent<ListProps> = (props) => {
  const classNames = cn({
    "govuk-summary-list": true,
    "govuk-summary-list--no-border": props.noBorders,
  });

  return (
    <dl className={classNames} data-qa={props.qa}>
      {props.children}
    </dl>
  );
};

export const SummaryListItem: React.FunctionComponent<ItemProps> = (props) => {
  const classNames = cn({
    "govuk-summary-list__row": true,
    "govuk-summary-list__row--error": props.validation && !props.validation.isValid && props.validation.showValidationErrors
  });
  const label = props.labelContent ? <Content value={props.labelContent} /> : props.label;
  return (
    <div className={classNames} data-qa={props.qa}>
      <dt className="govuk-summary-list__key">{label}</dt>
      <dd className="govuk-summary-list__value">{props.content}</dd>
      {!props.hideAction &&
        <dd className="govuk-summary-list__actions">
          {props.action}
        </dd>}
    </div>
  );
};
