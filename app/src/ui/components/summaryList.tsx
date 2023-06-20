import React from "react";
import cx from "classnames";
import type { ContentSelector } from "@copy/type";
import { useContent } from "@ui/hooks/content.hook";
import { Result } from "@ui/validation/result";
import { Markdown } from "./renderers/markdown";

export interface SummaryListProps {
  children: React.ReactNode;
  noBorders?: boolean;
  qa: string;
  className?: never;
}

export const SummaryList = ({ qa, noBorders, ...props }: SummaryListProps) => {
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
};

interface SummaryListItemProps {
  label: string | ContentSelector;
  action?: React.ReactNode;
  validation?: Result;
  qa: string;
}

interface SummaryListItemNotMarkdownProps extends SummaryListItemProps {
  content: React.ReactNode;
  isMarkdown?: false;
}

interface SummaryListItemMarkdownProps extends SummaryListItemProps {
  content: string;
  isMarkdown: true;
}

type Props = SummaryListItemMarkdownProps | SummaryListItemNotMarkdownProps;

export const SummaryListItem = ({ content, action, qa, validation, label, isMarkdown = false }: Props) => {
  const { getContent } = useContent();

  const hasError = validation && !validation.isValid && validation.showValidationErrors;

  return (
    <div
      data-qa={qa}
      className={cx("govuk-summary-list__row", {
        "summary-list__row--error": hasError,
      })}
    >
      <dt className="govuk-summary-list__key">{typeof label === "string" ? label : getContent(label)}</dt>
      <dd className="govuk-summary-list__value">{isMarkdown ? <Markdown value={content as string} /> : content}</dd>
      <dd className="govuk-summary-list__actions">{action}</dd>
    </div>
  );
};
