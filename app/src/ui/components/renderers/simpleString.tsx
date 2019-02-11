import React from "react";

interface Props {
  qa?: string;
}

export const SimpleString: React.FunctionComponent<Props> = (props) => <p className="govuk-body" data-qa={props.qa}>{props.children}</p>;
