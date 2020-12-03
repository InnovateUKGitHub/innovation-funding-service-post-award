import React from "react";
import cx from "classnames";

type DivAttr = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export interface GovWidthContainerProps extends DivAttr {
  children: React.ReactChild | React.ReactChild[];
  className?: string;
  style?: React.CSSProperties;
}

export function GovWidthContainer({ className, ...props }: GovWidthContainerProps) {
  return <div className={cx("govuk-width-container", className)} {...props} />;
}
