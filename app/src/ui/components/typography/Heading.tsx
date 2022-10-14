import React from "react";
import cx from "classnames";

export type GdsHeadingTypes = `h${"1" | "2" | "3" | "4"}`;
type HeadingAvailableElements = GdsHeadingTypes | "p";

export const gdsHeadingClasses: Record<GdsHeadingTypes, string> = {
  h1: "govuk-heading-xl",
  h2: "govuk-heading-l",
  h3: "govuk-heading-m",
  h4: "govuk-heading-s",
};

export interface HeadingBaseProps extends React.HTMLProps<HTMLHeadingElement> {
  children: string | React.ReactNode;
  className?: string;
  qa?: string;
  as?: HeadingAvailableElements;
}

export interface HeadingProps extends HeadingBaseProps {
  type: GdsHeadingTypes;

  // Discard unnecessary fields.
  formData?: unknown;
}

/**
 * Pre-styled GOV.UK headings
 * Removes the need to style HTML headings manually
 *
 * @returns A heading component, rendering as a regular HTML heading
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Heading({ type: HeadingType, as: AsComponent, className, qa, formData: _, ...rest }: HeadingProps) {
  const Element = AsComponent || HeadingType;
  const gdsHeadingClassName = gdsHeadingClasses[HeadingType];

  return <Element {...rest} data-qa={qa} className={cx(gdsHeadingClassName, className)} />;
}
