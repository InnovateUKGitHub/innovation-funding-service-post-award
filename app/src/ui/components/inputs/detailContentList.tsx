import React from "react";
import cx from "classnames";

import * as ACC from "@ui/components";
import { ExpandedItem } from "./formGuidanceExpander";

export interface DetailContentListProps {
  items: ExpandedItem[];
  qa: string;
}

export function DetailContentList({ items, qa }: DetailContentListProps) {
  if (!items.length) return null;

  return (
    <div data-qa={qa}>
      {items.map((x, i) => (
        <React.Fragment key={x.header}>
          <ACC.Renderers.SimpleString
            className={cx("govuk-!-font-weight-bold govuk-!-margin-bottom-1", {
              "govuk-!-padding-top-3": i === 0,
            })}
          >
            {x.header}
          </ACC.Renderers.SimpleString>

          <ACC.Renderers.SimpleString>{x.description}</ACC.Renderers.SimpleString>
        </React.Fragment>
      ))}
    </div>
  );
}
