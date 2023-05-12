import cx from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & { "data-qa"?: string };
export const FormGroup = ({ className, ...props }: Props) => (
  <div className={cx("govuk-form-group", className)} {...props} />
);
