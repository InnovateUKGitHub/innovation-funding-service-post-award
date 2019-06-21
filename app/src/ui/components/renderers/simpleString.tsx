import React from "react";

interface Props {
  qa?: string;
  className?: string;
}

export const SimpleString: React.FunctionComponent<Props> = (props) => <p className={`govuk-body ${props.className}`} data-qa={props.qa}>{props.children}</p>;
