import { useGovFrontend } from "@ui/hooks/gov-frontend.hook";
import classNames from "classnames";

interface InfoProps {
  summary: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  qa?: string;
}

export const Info = ({ qa, summary, children, className }: InfoProps) => {
  const { setRef } = useGovFrontend("Details");

  return (
    <details data-module="govuk-details" className={classNames("govuk-details", className)} ref={setRef} data-qa={qa}>
      <summary className="govuk-details__summary">
        <span className="govuk-details__summary-text">{summary}</span>
      </summary>

      <div className="govuk-details__text">{children}</div>
    </details>
  );
};
