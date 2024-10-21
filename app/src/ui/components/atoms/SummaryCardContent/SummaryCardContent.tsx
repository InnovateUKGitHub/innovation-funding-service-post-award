import { ReactNode } from "react";

const SummaryCardContent = ({ children }: { children: ReactNode }) => {
  return <div className="govuk-summary-card__content">{children}</div>;
};

export { SummaryCardContent };
