import cx from "classnames";
import { ReactNode } from "react";

type DivAttr = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export interface GovWidthContainerProps extends DivAttr {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  qa?: string;
}

export const GovWidthContainer = ({ className, qa, ...props }: GovWidthContainerProps) => (
  <div data-qa={qa} className={cx("govuk-width-container", className)} {...props} />
);
