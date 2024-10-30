import { Fragment, ReactNode } from "react";
import cx from "classnames";
import { SimpleString } from "@ui/components/atoms/SimpleString/simpleString";

export interface DetailContentListProps {
  items: { header: string; description: ReactNode }[];
  qa: string;
}

export const DetailContentList = ({ items, qa }: DetailContentListProps) => {
  if (!items.length) return null;

  return (
    <div data-qa={qa}>
      {items.map((x, i) => (
        <Fragment key={x.header}>
          <SimpleString
            className={cx("govuk-!-font-weight-bold govuk-!-margin-bottom-1", {
              "govuk-!-padding-top-3": i === 0,
            })}
          >
            {x.header}
          </SimpleString>

          {x.description}
        </Fragment>
      ))}
    </div>
  );
};
