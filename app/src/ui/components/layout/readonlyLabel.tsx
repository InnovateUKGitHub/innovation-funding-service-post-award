import { ReactNode } from "react";
import type { ContentSelector } from "@copy/type";
import { Content } from "../content";

interface Props {
  label?: string;
  labelContent?: ContentSelector;
  qa?: string;
  children: ReactNode;
}

export const ReadonlyLabel: React.FunctionComponent<Props> = ({ qa, label, labelContent, children }: Props) => {
  if (!label && !labelContent) return null;
  return (
    <span>
      <h3 className="govuk-heading-m" data-qa={`label-${qa}`}>
        {labelContent ? <Content value={labelContent} /> : label}
      </h3>
      {children}
    </span>
  );
};
