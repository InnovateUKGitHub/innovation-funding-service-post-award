import React from "react";
import { govukBorderColour } from "@ui/styles/colours";
import { H3 } from "../typography/Heading.variants";

export interface SectionPanelProps {
  children: React.ReactElement;
  title?: React.ReactNode;
  qa?: string;
  styles?: never;
}

const SectionPanelStyles = {
  border: `1px solid ${govukBorderColour}`,
};

/**
 * SectionPanel component
 */
export function SectionPanel({ qa, title, children }: SectionPanelProps) {
  return (
    <div className="govuk-!-padding-3" data-qa={qa} style={SectionPanelStyles}>
      {title && (
        <H3 as="h2" className="govuk-!-margin-bottom-6">
          {title}
        </H3>
      )}

      {children}
    </div>
  );
}
