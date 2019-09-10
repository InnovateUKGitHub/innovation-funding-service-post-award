import React from "react";
import classNames from "classnames";

interface Props {
  qa?: string;
  className?: string;
}

export const SimpleString: React.FunctionComponent<Props> = (props) => <p className={classNames("govuk-body", props.className)} data-qa={props.qa}>{props.children}</p>;
