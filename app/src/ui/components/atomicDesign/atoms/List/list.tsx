import React from "react";
import cx from "classnames";

type ListItemAttr = React.HTMLAttributes<HTMLOListElement | HTMLUListElement>;

export interface ListBaseProps extends ListItemAttr {
  children: React.ReactNode | React.ReactNode[];
  qa?: string;
  className?: string;
  noBottomMargin?: boolean;
}

const listOptions: Record<string, ["ol" | "ul", string]> = {
  number: ["ol", "govuk-list--number"],
  bullet: ["ul", "govuk-list--bullet"],
  plain: ["ul", "govuk-list--plain"],
};
export interface ListProps extends ListBaseProps {
  type?: keyof typeof listOptions;
}

/**
 * List component defaulting to unordered list
 */
export function List({ type, qa, noBottomMargin, className, ...props }: ListProps) {
  const [Element = "ul", gdsStyle] = type ? listOptions[type] : [];

  return (
    <Element
      {...props}
      data-qa={qa}
      className={cx("govuk-list", gdsStyle, { "govuk-!-margin-bottom-0": noBottomMargin }, className)}
    />
  );
}

/**
 * Unordered List component with bullets
 */
export function UL(props: ListBaseProps & React.HTMLProps<HTMLUListElement>) {
  return <List {...props} type="bullet" />;
}

/**
 * Ordered list
 */
export function OL(props: ListBaseProps & React.HTMLProps<HTMLOListElement>) {
  return <List {...props} type="number" />;
}

/**
 * Plain unordered list
 */
export function PlainList(props: ListBaseProps & React.HTMLProps<HTMLOListElement>) {
  return <List {...props} type="plain" />;
}
