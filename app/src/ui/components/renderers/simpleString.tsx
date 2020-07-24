import React from "react";
import classNames from "classnames";

interface Props {
  qa?: string;
  className?: string;
  multiline?: boolean;
  bold?: boolean;
}

export const SimpleString: React.FunctionComponent<Props> = (props) => {
  const className = classNames(
    "govuk-body",
    {
      "govuk-body--multiline": props.multiline || false,
      "govuk-!-font-weight-bold": props.bold || false
    },
    props.className
  );

  return (<p className={className} data-qa={props.qa}>{props.children}</p>);
};
