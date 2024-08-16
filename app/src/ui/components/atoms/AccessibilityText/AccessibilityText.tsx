import cx from "classnames";

interface AccessibilityTextProps {
  children: string | React.ReactElement;
  as?: "span" | "div";
  className?: string;
}

/**
 * Accessibility text adds text intended to be read by screen readers
 */
export const AccessibilityText = ({ as: Element = "div", className, ...props }: AccessibilityTextProps) => (
  <Element className={cx("govuk-visually-hidden", className)} {...props} />
);
