import cx from "classnames";

interface AccessibilityTextProps {
  children: string | React.ReactElement;
  as?: "span" | "div";
  className?: string;
}

export function AccessibilityText({ as: Element = "div", className, ...props }: AccessibilityTextProps) {
  return <Element className={cx("govuk-visually-hidden", className)} {...props} />;
}
