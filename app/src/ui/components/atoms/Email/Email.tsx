import React from "react";
import cx from "classnames";

type AnchorAttr = React.HTMLProps<HTMLAnchorElement>;
export interface EmailProps extends AnchorAttr {
  children?: string;
  qa?: string;
  href?: string;
  className?: string;
}

/**
 * Email component, rendered as anchor
 */
export function Email({ href, className, qa, children, ...props }: EmailProps) {
  if (!children) return null;

  const fallbackHref = children.trim();

  const [mailbox, domain] = children.split("@");

  return (
    <a
      href={`mailto:${href || fallbackHref}`}
      data-qa={qa}
      className={cx("govuk-link govuk-!-font-size-19", className)}
      {...props}
    >
      {mailbox}
      <wbr />@{domain}
    </a>
  );
}
