import cx from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLLegendElement>, HTMLLegendElement> & {
  "data-qa"?: string;
  isSubQuestion?: boolean;
};

export const Legend = ({ className, isSubQuestion, ...rest }: Props) => (
  <legend
    className={cx(
      "govuk-fieldset__legend",
      {
        "govuk-fieldset__legend--s": isSubQuestion,
        "govuk-fieldset__legend--m": !isSubQuestion,
      },
      className,
    )}
    {...rest}
  />
);
