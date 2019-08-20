import * as React from "react";
import classNames from "classnames";
import { CSSProperties } from "react";
import { GOVUK_ERROR_COLOUR, GOVUK_LINK_COLOUR } from "../styles/colours";

export interface StyledButtonProps extends React.ButtonHTMLAttributes<{}> {
  styling: "Link" | "Secondary" | "Primary" | "Warning";
  className?: string;
  style?: CSSProperties;
}

const govukButton = "govuk-button";

const getLinkButtonStyling = (className?: string, style?: CSSProperties) => {
  const linkStyles = classNames(className, "govuk-link");
  return { className: linkStyles, style };
};

const getPrimaryButtonStyling = (className?: string, style?: CSSProperties) => {
  const linkStyles = classNames(className, govukButton);
  return { className: linkStyles, style };
};

const getSecondaryButtonStyling = (className?: string, style?: CSSProperties) => {
  const linkStyles = classNames(className, govukButton, "govuk-button--secondary");
  return { className: linkStyles, style };
};

const getWarningButtonStyling = (className?: string, style?: CSSProperties) => {
  const linkStyles = classNames(className, govukButton, "govuk-button--warning");
  return { className: linkStyles, style };
};

const getButtonStyling = ({styling, className, style}: StyledButtonProps) => {
  switch (styling) {
    case "Warning": return getWarningButtonStyling(className, style);
    case "Link": return getLinkButtonStyling(className, style);
    case "Secondary": return getSecondaryButtonStyling(className, style);
    case "Primary":
    default: return getPrimaryButtonStyling(className, style);
  }
};

export const Button: React.SFC<StyledButtonProps> = (props) => {
  const { className, styling, style, children, ...rest } = props;
  const buttonStyling = getButtonStyling({className, styling, style});
  return <button data-module="govuk-button" {...buttonStyling} {...rest}>{children}</button>;
};
