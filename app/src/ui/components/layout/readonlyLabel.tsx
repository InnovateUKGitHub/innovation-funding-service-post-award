import React from "react";
import { ContentSelector } from "@content/content";
import { Content } from "@ui/components";

interface Props {
  label?: string;
  labelContent?: ContentSelector;
  qa?: string;
}

export const ReadonlyLabel: React.FunctionComponent<Props> = ({ qa, label, labelContent, children }) => {
  if (!label && !labelContent) return null;
  return (
    <span>
      <h3 className="govuk-heading-m" data-qa={`label-${qa}`}>
        {!!labelContent ? <Content value={labelContent}/> : label}
      </h3>
      {children}
    </span>
  );
};
