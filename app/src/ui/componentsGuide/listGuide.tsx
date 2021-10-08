import { UL, OL, PlainList } from "@ui/components";
import { IGuide } from "@framework/types";

export const listGuide: IGuide = {
  name: "List",
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
    {
      name: "Plain list",
      comments: "Renders an plain list with the required govuk styles",
      example: `
      import { PlainList } from "@ui/components";

      <PlainList>
        <li>First item</li>
        <li>Second item</li>
      </PlainList>
      `,
      render: () => (
        <PlainList>
          <li>First item</li>
          <li>Second item</li>
        </PlainList>
      ),
    },
  ],
};
