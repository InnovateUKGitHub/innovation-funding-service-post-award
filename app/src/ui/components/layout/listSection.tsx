import * as React from "react";

interface Props {
  title: React.ReactNode;
  qa?: string;
  // openNewWindow: boolean;
}

export const ListSection: React.SFC<Props> = (props) => {
  return (
    <div className="govuk-!-padding-5 govuk-!-margin-bottom-9" style={{ backgroundColor: "#dee0e2" }} data-qa={props.qa}>
      <h3 className="govuk-heading-m">{props.title}</h3>
      {props.children}
    </div>
  );
};

export const ListItem: React.SFC = (props) => (
  <div
    className="govuk-grid-row govuk-!-padding-4 govuk-!-margin-0 govuk-!-margin-bottom-5"
    style={{ backgroundColor: "white" }}
  >
    {props.children}
  </div>
);
