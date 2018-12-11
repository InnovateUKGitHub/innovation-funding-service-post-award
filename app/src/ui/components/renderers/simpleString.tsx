import React from "react";

interface Props {
  qa?: string;
}

export const SimpleString: React.SFC<Props> = (props) => <p className="govuk-body" data-qa={props.qa}>{props.children}</p>;
