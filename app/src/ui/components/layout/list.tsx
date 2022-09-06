import React from "react";
import cx from "classnames";

type ListItemAttr = React.HTMLAttributes<HTMLOListElement | HTMLUListElement>;

export interface ListBaseProps extends ListItemAttr {
  children: React.ReactNode | React.ReactNode[];
  qa?: string;
  className?: string;
}

const listOptions: Record<string, ["ol" | "ul", string]> = {
  number: ["ol", "govuk-list--number"],
  bullet: ["ul", "govuk-list--bullet"],
  plain: ["ul", "govuk-list--plain"],
};
export interface ListProps extends ListBaseProps {
  type?: keyof typeof listOptions;
}

export function List({ type, qa, className, ...props }: ListProps) {
  const [Element = "ul", gdsStyle] = type ? listOptions[type] : [];

  return <Element {...props} data-qa={qa} className={cx("govuk-list", gdsStyle, className)} />;
}

export function UL(props: ListBaseProps & React.HTMLProps<HTMLUListElement>) {
  return <List {...props} type="bullet" />;
}

export function OL(props: ListBaseProps & React.HTMLProps<HTMLOListElement>) {
  return <List {...props} type="number" />;
}

export function PlainList(props: ListBaseProps & React.HTMLProps<HTMLOListElement>) {
  return <List {...props} type="plain" />;
}
