import * as React from "react";
import classNames from "classnames";
import { CSSProperties } from "react";
import { GOVUK_LINK_COLOUR } from "../styles/colours";

export interface StyledButtonProps extends React.ButtonHTMLAttributes<{}> {
  styling: "Link" | "Secondary" | "Primary";
  className?: string;
  style?: CSSProperties;
}

const renderLinkButton = ({ className, styling, style, children, ...rest }: StyledButtonProps) => {
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
  return <button className={linkStyles} style={linkStyle} {...rest}>{children}</button>;
};

const renderPrimaryButton = ({ className, styling, style, children, ...rest }: StyledButtonProps) => {
  const linkStyles = classNames(className, "govuk-button");
  const linkStyle: CSSProperties = { ...style };
  return <button className={linkStyles} style={linkStyle} {...rest}>{children}</button>;
};

const renderSecondaryButton = ({ className, styling, style, children, ...rest }: StyledButtonProps) => {
  const linkStyles = classNames(className, "govuk-button");
  const linkStyle: CSSProperties = {
    background: "buttonface",
    color: "buttontext",
    ...style
  };
  return <button className={linkStyles} style={linkStyle} {...rest}>{children}</button>;
};

export const Button: React.SFC<StyledButtonProps> = (props) => {
  switch (props.styling) {
    case "Link": return renderLinkButton(props);
    case "Secondary": return renderSecondaryButton(props);
    case "Primary":
    default: return renderPrimaryButton(props);
  }
};
