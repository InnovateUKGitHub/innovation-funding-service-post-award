import cx from "classnames";
import { ReactNode } from "react";

type DivAttr = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export interface GovWidthContainerProps extends DivAttr {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const GovWidthContainer = ({ className, ...props }: GovWidthContainerProps) => (
  <div className={cx("govuk-width-container", className)} {...props} />
);
