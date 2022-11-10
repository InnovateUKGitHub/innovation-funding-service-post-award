import cx from "classnames";

type DivAttr = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

export interface GovWidthContainerProps extends DivAttr {
  children: React.ReactChild | React.ReactChild[];
  className?: string;
  style?: React.CSSProperties;
}

export const GovWidthContainer = ({ className, ...props }: GovWidthContainerProps) => (
  <div className={cx("govuk-width-container", className)} {...props} />
);
