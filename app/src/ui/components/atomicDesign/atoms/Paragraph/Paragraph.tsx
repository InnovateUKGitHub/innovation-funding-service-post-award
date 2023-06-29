import cx from "classnames";
import { DetailedHTMLProps, HTMLAttributes } from "react";

type Props = DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement> & {
  "data-qa"?: string;
  multiline?: boolean;
  bold?: boolean;
};

/**
 * plain `p` tag with GDS classes
 */
export function P({ children, className, multiline, bold, ...props }: Props) {
  return (
    <p
      className={cx(className, "govuk-body", {
        "govuk-body--multiline": multiline,
        "govuk-!-font-weight-bold": bold,
      })}
      {...props}
    >
      {children}
    </p>
  );
}
