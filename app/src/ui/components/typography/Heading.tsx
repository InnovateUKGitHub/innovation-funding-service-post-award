import React from "react";
import cx from "classnames";

export type GdsHeadingClasses = `govuk-heading-${"xl" | "l" | "m" | "s"}`;
export type GdsHeadingTypes = `h${"1" | "2" | "3" | "4"}`;

const gdsHeadingClasses: Record<GdsHeadingTypes, GdsHeadingClasses> = {
  h1: "govuk-heading-xl",
  h2: "govuk-heading-l",
  h3: "govuk-heading-m",
  h4: "govuk-heading-s",
};

export interface HeadingBaseProps extends React.HTMLProps<HTMLHeadingElement> {
  children: string | React.ReactElement;
  className?: string;
  qa?: string;
}

export interface HeadingProps extends HeadingBaseProps {
  type: GdsHeadingTypes;
}

export function Heading({ type, className, qa, ...props }: HeadingProps) {
  const Element = type;
  const gdsHeadingClassName = gdsHeadingClasses[type];

  return <Element {...props} data-qa={qa} className={cx(gdsHeadingClassName, className)} />;
}

