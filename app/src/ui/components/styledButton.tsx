import * as React from "react";
import classNames from "classnames";
import { CSSProperties } from "react";
import { GOVUK_LINK_COLOUR } from "../styles/colours";

interface Props extends React.HTMLAttributes<{}> {
  styling: "Link";
  className?: string;
  style?: CSSProperties;
}

export const Button: React.SFC<Props> = (props) => {
  const { className, styling, style, children, ...rest } = props;
  if (styling === "Link") {
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
  }
  return null;
};
