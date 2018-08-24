import * as React from "react";

interface Props {
  title: React.ReactNode;
}

export const SubSection: React.SFC<Props> = (props) => {
  return (
    <div className="govuk-!-padding-5 govuk-!-margin-bottom-9" style={{ backgroundColor: "#dee0e2" }}>
      <h3 className="govuk-heading-m">{props.title}</h3>
      {props.children}
    </div>
  );
};
