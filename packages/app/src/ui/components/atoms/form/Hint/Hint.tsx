import cx from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  "data-qa"?: string;
  id: `hint-for-${string}`;
};
export const Hint = ({ className, ...props }: Props) => <div className={cx("govuk-hint", className)} {...props} />;
