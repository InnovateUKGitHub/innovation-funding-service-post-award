import { UL, OL } from "@ui/components";
import { IGuide } from "@framework/types";

export const ulGuide: IGuide = {
  name: "UL - Unordered List",
  options: [
    {
      name: "Unordered list",
      comments: "Renders an unordered list with the required govuk styles",
      example: `
      import { UL } from "@ui/components";

      <UL>
        <li>First item</li>
        <li>Second item</li>
      </UL>
      `,
      render: () => (
        <UL>
          <li>First item</li>
          <li>Second item</li>
        </UL>
      ),
    },
  ],
};

export const olGuide: IGuide = {
  name: "OL - Ordered List",
  options: [
    {
      name: "Ordered list",
      comments: "Renders an ordered list with the required govuk styles",
      example: `
      import { OL } from "@ui/components";

      <OL>
        <li>First todo</li>
        <li>Second todo</li>
      </OL>
      `,
      render: () => (
        <OL>
          <li>First todo</li>
          <li>Second todo</li>
        </OL>
      ),
    },
  ],
};
