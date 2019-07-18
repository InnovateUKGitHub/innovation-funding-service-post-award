import React from "react";

export const Info: React.FunctionComponent<{ summary: string }> = ({ summary, children }) => {
  return (
    <details className="govuk-details">
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">{summary}</span>
      </summary>
      <div className="govuk-details__text">{children}</div>
    </details>
  );
};
