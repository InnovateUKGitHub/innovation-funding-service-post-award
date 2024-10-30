import cx from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  "data-qa"?: string;
  hasError?: boolean;
  noMarginBottom?: boolean;
};
export const FormGroup = ({ className, noMarginBottom, hasError, ...props }: Props) => (
  <div
    className={cx(
      "govuk-form-group",
      {
        "govuk-form-group--error": hasError,
        "govuk-!-margin-bottom-0": noMarginBottom,
        "govuk-!-padding-bottom-0": noMarginBottom,
      },
      className,
    )}
    {...props}
  />
);
