import { ReactNode } from "react";
import type { ContentSelector } from "@copy/type";
import { Content } from "../../molecules/Content/content";
import { H3 } from "../Heading/Heading.variants";

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
      <H3 className="govuk-heading-m" data-qa={`label-${qa}`}>
        {labelContent ? <Content value={labelContent} /> : label}
      </H3>
      {children}
    </span>
  );
};
