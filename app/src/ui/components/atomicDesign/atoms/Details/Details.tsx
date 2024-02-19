interface InfoProps {
  summary: React.ReactNode;
  children: React.ReactNode;
  qa?: string;
}

export const Info = ({ qa, summary, children }: InfoProps) => {
  return (
    <details data-module="govuk-details" className="govuk-details" data-qa={qa}>
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">{summary}</span>
      </summary>

      <div className="govuk-details__text">{children}</div>
    </details>
  );
};
