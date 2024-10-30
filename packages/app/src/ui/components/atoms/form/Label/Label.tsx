import cx from "classnames";
import { DetailedHTMLProps, LabelHTMLAttributes } from "react";

type Props = DetailedHTMLProps<LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement> & {
  "data-qa"?: string;
  htmlFor: string;
  bold?: boolean;
};
export const Label = ({ className, htmlFor, bold, ...props }: Props) => (
  <label className={cx("govuk-label", { "govuk-label--m": bold }, className)} htmlFor={htmlFor} {...props} />
);
