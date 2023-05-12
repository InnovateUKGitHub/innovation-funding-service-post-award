import cx from "classnames";
import { DetailedHTMLProps, LabelHTMLAttributes } from "react";

type Props = DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> & {
  "data-qa"?: string;
  htmlFor: string;
};
export const Label = ({ className, htmlFor, ...props }: Props) => (
  <label className={cx("govuk-label", className)} htmlFor={htmlFor} {...props} />
);
