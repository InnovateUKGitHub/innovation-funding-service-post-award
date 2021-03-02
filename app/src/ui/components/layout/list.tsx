import React from "react";
import cx from "classnames";

export interface ListBaseProps {
  children: React.ReactNode | React.ReactChild[];
  className?: string;
  qa?: string;
}

const listOptions: Record<string, "ol" | "ul"> = {
  number: "ol",
  bullet: "ul",
};
export interface ListProps extends ListBaseProps {
  type: keyof typeof listOptions;
}

export function List({ type, qa, className, ...rest }: ListProps) {
  const Element = listOptions[type];

  return <Element {...rest} data-qa={qa} className={cx(`govuk-list govuk-list--${type}`, className)} />;
}

export function UL(props: ListBaseProps & React.HTMLProps<HTMLUListElement>) {
  return <List {...props} type="bullet" />;
}

export function OL(props: ListBaseProps & React.HTMLProps<HTMLOListElement>) {
  return <List {...props} type="number" />;
}
