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
      <h3 className="govuk-heading-m">{props.title}</h3>
      {props.children}
    </div>
  );
};

export const ListItem: React.SFC<{ icon?: "none" | "warning" | "edit" }> = (props) => {
  const className = classNames({
    "govuk-grid-row": true,
    "govuk-!-padding-4": true,
    "govuk-!-margin-0": true,
    "govuk-!-margin-bottom-2": true
  });

  const style: React.CSSProperties = {
    backgroundColor: "white",
    border: `1px solid ${colour.GOVUK_BORDER_COLOUR}`,
  };

  if (props.icon === "warning") {
    style.borderLeft = `5px solid ${colour.GOVUK_ERROR_COLOUR}`;
  }
  else if(props.icon === "edit") {
    style.borderLeft = `5px solid ${colour.GOVUK_COLOUR_BLACK}`;
  }

  return (
    <div className={className} style={style}>
      {props.children}
    </div>
  );
};
