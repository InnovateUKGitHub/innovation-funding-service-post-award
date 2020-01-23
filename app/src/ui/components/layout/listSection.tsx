import * as React from "react";
import classNames from "classnames";

export const ListItem: React.FunctionComponent<{ actionRequired?: boolean, qa?: string }> = (props) => {
  const className = classNames("govuk-grid-row", "govuk-!-padding-4", "govuk-!-margin-bottom-2", "acc-list-item", {
    "acc-list-item__actionRequired": props.actionRequired,
  });

  return (
    <div className={className} data-qa={props.qa}>
      {props.children}
    </div>
  );
};
