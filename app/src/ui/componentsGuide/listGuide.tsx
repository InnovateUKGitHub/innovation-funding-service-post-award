import { IGuide } from "@framework/types/IGuide";
import { UL, OL, PlainList } from "@ui/components/layout/list";

export const listGuide: IGuide = {
  name: "List",
  options: [
    {
      name: "Unordered list",
      comments: "Renders an unordered list with the required govuk styles",
      example: `
      

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
