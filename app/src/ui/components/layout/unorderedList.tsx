import * as React from "react";

export const UnorderedList: React.FunctionComponent<{ qa?: string }> = (props) => {
  const classNames = "govuk-list govuk-list--bullet govuk-!-margin-bottom-10";

  return (
    <ul className={classNames} data-qa={props.qa}>
      {props.children}
    </ul>
  );
};
