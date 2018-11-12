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
  const styles = classNames(className, "govuk-link");
  const linkStyle: CSSProperties = {
    color: GOVUK_LINK_COLOUR,
    padding: 0,
    cursor: "pointer",
    textDecoration: "underline",
    backgroundColor: "inherit",
    border: "none",
    boxSizing: "unset",
    ...style
  };
  if (styling === "Link") {
    return <button className={styles} style={linkStyle} {...rest}>{children}</button>;
  }
  return null;
};
