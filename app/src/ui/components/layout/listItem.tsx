import * as React from "react";
import cx from "classnames";

export interface ListItemProps {
  children: React.ReactNode;
  actionRequired?: boolean;
  qa?: string;
  className?: never;
}

export function ListItem({ qa, actionRequired, ...props }: ListItemProps) {
  return (
    <div
      {...props}
      data-qa={qa}
      className={cx(
        "govuk-grid-row",
        "govuk-!-padding-4",
        "govuk-!-margin-bottom-2",
        "acc-list-item",
        {
          "acc-list-item__actionRequired": actionRequired,
        }
      )}
    />
  );
}
