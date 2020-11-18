import * as React from "react";
import cx from "classnames";

type AnchorAttr = React.HTMLProps<HTMLAnchorElement>;
export interface EmailProps extends AnchorAttr {
  children: string;
  qa?: string;
}

export function Email({ href, className, qa, ...props }: EmailProps) {
  if (!props.children.length) return null;

  const fallbackHref = props.children.trim();

  return (
    // tslint:disable-next-line: react-a11y-anchors
    <a
      href={`mailto:${href || fallbackHref}`}
      data-qa={qa}
      className={cx("govuk-link govuk-!-font-size-19", className)}
      {...props}
    />
  );
}
