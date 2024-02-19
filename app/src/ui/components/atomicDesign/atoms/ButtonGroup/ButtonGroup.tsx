import { ReactNode } from "react";

const ButtonGroup = ({ children }: { children: ReactNode }) => {
  return <div className="govuk-button-group">{children}</div>;
};

export { ButtonGroup };
