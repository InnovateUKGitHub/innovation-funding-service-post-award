import { ReactNode } from "react";

const SummaryCardTitle = ({
  children,
  header: Header,
}: {
  children: ReactNode;
  header: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}) => {
  return (
    <div className="govuk-summary-card__title-wrapper">
      <Header className="govuk-summary-card__title">{children}</Header>
    </div>
  );
};

export { SummaryCardTitle };
