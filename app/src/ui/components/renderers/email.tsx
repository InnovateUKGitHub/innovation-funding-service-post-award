import React from "react";
import cx from "classnames";

type AnchorAttr = React.HTMLProps<HTMLAnchorElement>;
export interface EmailProps extends AnchorAttr {
  children: string;
  qa?: string;
  href?: string;
  className?: string;
}

export function Email({ href, className, qa, children, ...props }: EmailProps) {
  const fallbackHref = children.trim();
  if (!children.length) return null;

  return (
    <a
      href={`mailto:${href || fallbackHref}`}
      data-qa={qa}
      className={cx("govuk-link govuk-!-font-size-19", className)}
      {...props}
    >
      {children}
    </a>
  );
}
