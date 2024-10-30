import { ReactNode } from "react";

const SummaryCard = ({ children }: { children: ReactNode }) => {
  return <div className="govuk-summary-card">{children}</div>;
};

export { SummaryCard };
