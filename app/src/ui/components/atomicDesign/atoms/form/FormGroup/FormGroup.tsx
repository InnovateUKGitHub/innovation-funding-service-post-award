import cx from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  "data-qa"?: string;
  hasError?: boolean;
};
export const FormGroup = ({ className, hasError, ...props }: Props) => (
  <div className={cx("govuk-form-group", { "govuk-form-group--error": hasError }, className)} {...props} />
);
