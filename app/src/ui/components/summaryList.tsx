import React from "react";
import cx from "classnames";

import { Result } from "@ui/validation";
import { ContentSelector } from "@content/content";
import { useContent } from "@ui/hooks";

export interface SummaryListProps {
  children: React.ReactNode;
  noBorders?: boolean;
  qa: string;
  className?: never;
}

export function SummaryList({ qa, noBorders, ...props }: SummaryListProps) {
  return (
    <dl
      {...props}
      data-qa={qa}
      className={cx({
        "govuk-summary-list": true,
        "govuk-summary-list--no-border": noBorders,
      })}
    />
  );
}

interface SummaryListItemProps {
  label: string | ContentSelector;
  content: React.ReactNode;
  action?: React.ReactNode;
  validation?: Result;
  qa: string;
}
export function SummaryListItem({ content, action, qa, validation, label }: SummaryListItemProps) {
  const { getContent } = useContent();

  const hasError = validation && !validation.isValid && validation.showValidationErrors;

  return (
    <div
      data-qa={qa}
      className={cx("govuk-summary-list__row", {
        "summary-list__row--error": hasError,
      })}
    >
      <dt className="govuk-summary-list__key">{getContent(label)}</dt>
      <dd className="govuk-summary-list__value">{content}</dd>
      <dd className="govuk-summary-list__actions">{action}</dd>
    </div>
  );
}
