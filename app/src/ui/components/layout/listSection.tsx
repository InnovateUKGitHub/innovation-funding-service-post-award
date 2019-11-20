import * as React from "react";
import * as colour from "../../styles/colours";
import classNames from "classnames";

interface Props {
  title: React.ReactNode;
  qa?: string;
}

export const ListSection: React.SFC<Props> = (props) => {
  return (
    <div className="govuk-!-padding-5 govuk-!-margin-bottom-9" style={{ backgroundColor: colour.GOVUK_COLOUR_GREY_3 }} data-qa={props.qa}>
      <h2 className="govuk-heading-m">{props.title}</h2>
      {props.children}
    </div>
  );
};

export const ListItem: React.SFC<{ actionRequired?: boolean, qa?: string }> = (props) => {
  const className = classNames("govuk-grid-row", "govuk-!-padding-4", "govuk-!-margin-bottom-2", "acc-list-item", {
    "acc-list-item__actionRequired": props.actionRequired,
  });

  return (
    <div className={className} data-qa={props.qa}>
      {props.children}
    </div>
  );
};
