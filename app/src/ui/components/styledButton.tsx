import * as React from "react";
import classNames from "classnames";
import { CSSProperties } from "react";
import { GOVUK_LINK_COLOUR } from "../styles/colours";

export interface StyledButtonProps extends React.ButtonHTMLAttributes<{}> {
  styling: "Link" | "Secondary" | "Primary";
  className?: string;
  style?: CSSProperties;
}

const getLinkButtonStyling = (className?: string, style?: CSSProperties) => {
  const linkStyles = classNames(className, "govuk-link");
  const linkStyle: CSSProperties = {
    color: GOVUK_LINK_COLOUR,
    cursor: "pointer",
    textDecoration: "underline",
    backgroundColor: "inherit",
    border: "none",
    boxSizing: "unset",
    ...style
  };
  return { className: linkStyles, style: linkStyle };
};

const getPrimaryButtonStyling = (className?: string, style?: CSSProperties) => {
  const linkStyles = classNames(className, "govuk-button");
  const linkStyle: CSSProperties = { ...style };
  return { className: linkStyles, style: linkStyle };
};

const getSecondaryButtonStyling = (className?: string, style?: CSSProperties) => {
  const linkStyles = classNames(className, "govuk-button");
  const linkStyle: CSSProperties = {
    background: "buttonface",
    color: "buttontext",
    ...style
  };
  return { className: linkStyles, style: linkStyle };
};

const getButtonStyling = ({styling, className, style}: StyledButtonProps) => {
  switch (styling) {
    case "Link": return getLinkButtonStyling(className, style);
    case "Secondary": return getSecondaryButtonStyling(className, style);
    case "Primary":
    default: return getPrimaryButtonStyling(className, style);
  }
};

export const Button: React.SFC<StyledButtonProps> = (props) => {
  const { className, styling, style, children, ...rest } = props;
  const buttonStyling = getButtonStyling({className, styling, style});
  return <button {...buttonStyling} {...rest}>{children}</button>;
};
