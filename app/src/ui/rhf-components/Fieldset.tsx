import cx from "classnames";
import { DetailedHTMLProps, FieldsetHTMLAttributes } from "react";

type Props = DetailedHTMLProps<FieldsetHTMLAttributes<HTMLFieldSetElement>, HTMLFieldSetElement> & {
  "data-qa"?: string;
};

export const Fieldset = ({ className, ...rest }: Props) => (
  <fieldset className={cx("govuk-fieldset", className)} {...rest} />
);
