import classNames from "classnames";
import { CSSProperties } from "react";

interface SimpleStringProps {
  as?: "p" | "span" | "div";
  qa?: string;
  multiline?: boolean;
  verticalScrollbar?: boolean;
  bold?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Basic string component
 * accepts any of "p", "span", "div", defaults to "p"
 */
export function SimpleString({
  as: Element = "p",
  qa,
  className,
  multiline,
  verticalScrollbar,
  bold,
  children,
  style,
}: SimpleStringProps) {
  return (
    <Element
      data-qa={qa}
      className={classNames(className, "govuk-body", {
        "govuk-body--multiline": multiline,
        "govuk-!-font-weight-bold": bold,
        "acc-height-container acc-vertical-scrollbar": verticalScrollbar,
      })}
      style={style}
    >
      {children}
    </Element>
  );
}
