import React from "react";
import { useGovFrontend } from "@ui/hooks";

interface InfoProps {
  summary: React.ReactNode;
  children: React.ReactNode;
  qa?: string;
}

export function Info({ qa, summary, children }: InfoProps) {
  const { setRef } = useGovFrontend("Details");

  return (
    <details data-module="govuk-details" className="govuk-details" ref={setRef} data-qa={qa}>
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">{summary}</span>
      </summary>

      <div className="govuk-details__text">{children}</div>
    </details>
  );
}
