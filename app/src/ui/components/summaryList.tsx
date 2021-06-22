import cn from "classnames";
import { Result } from "@ui/validation";
import { ContentSelector } from "@content/content";
import { Content } from "./content";

export interface SummaryListProps {
  children: React.ReactNode;
  noBorders?: boolean;
  qa: string;
}

export function SummaryList({ qa, noBorders, ...props }: SummaryListProps) {
  return (
    <dl
      data-qa={qa}
      className={cn({
        "govuk-summary-list": true,
        "govuk-summary-list--no-border": noBorders,
      })}
      {...props}
    />
  );
}

interface SummaryListItemProps {
  label?: React.ReactNode;
  labelContent?: ContentSelector;
  content: React.ReactNode;
  action?: React.ReactNode;
  validation?: Result;
  qa: string;
}
export function SummaryListItem({ content, action, qa, validation, labelContent, label }: SummaryListItemProps) {
  const labelValue = labelContent ? <Content value={labelContent} /> : label;

  const displaySummaryError = validation && !validation.isValid && validation.showValidationErrors;

  return (
    <div
      data-qa={qa}
      className={cn("govuk-summary-list__row", {
        "govuk-summary-list__row--error": displaySummaryError,
      })}
    >
      <dt className="govuk-summary-list__key">{labelValue}</dt>
      <dd className="govuk-summary-list__value">{content}</dd>
      <dd className="govuk-summary-list__actions">{action}</dd>
    </div>
  );
}
