import React from "react";
import cx from "classnames";

import { ExpandedItem } from "./formGuidanceExpander";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";

export interface DetailContentListProps {
  items: ExpandedItem[];
  qa: string;
}

export const DetailContentList = ({ items, qa }: DetailContentListProps) => {
  if (!items.length) return null;

  return (
    <div data-qa={qa}>
      {items.map((x, i) => (
        <React.Fragment key={x.header}>
          <SimpleString
            className={cx("govuk-!-font-weight-bold govuk-!-margin-bottom-1", {
              "govuk-!-padding-top-3": i === 0,
            })}
          >
            {x.header}
          </SimpleString>

          <SimpleString>{x.description}</SimpleString>
        </React.Fragment>
      ))}
    </div>
  );
};
