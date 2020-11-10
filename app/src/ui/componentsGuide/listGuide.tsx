import React from "react";
import { UnorderedList } from "@ui/components";
import { IGuide } from "@framework/types";

export const listGuide: IGuide = {
    name: "List",
    options: [
        {
            name: "Unordered List",
            comments: "Renders an unordered list with the required govuk styles",
            example: "  <UnorderedList>\n" +
              "    <li>item the first</li>\n" +
              "    <li>item the second</li>\n" +
              "  </UnorderedList>",
            render: () => (
              <UnorderedList>
                  <li>item the first</li>
                  <li>item the second</li>
              </UnorderedList>
            )
        }
    ]
};
