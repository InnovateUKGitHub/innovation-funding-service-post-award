import React from "react";
import { render } from "@testing-library/react";
import TestBed from "@shared/TestBed";
import { DetailContentList, DetailContentListProps } from "@ui/components/inputs/detailContentList";
import { ExpandedItem } from "@ui/components/inputs/formGuidanceExpander";

const stubItems = [
  { header: "stub-title1", description: "stub-description1" },
  { header: "stub-title2", description: "stub-description2" },
  { header: "stub-title3", description: "stub-description3" },
];

describe("<DetailContentList />", () => {
  const setupComponent = (props: DetailContentListProps) =>
    render(
      <TestBed>
        <DetailContentList {...props} />
      </TestBed>,
    );

  const stubQA = "stub-qa";
  const oneItem = stubItems.splice(0, 1);
  const multipleItems = stubItems.splice(0, 2);

  test.each`
    name                     | items
    ${"with one item"}       | ${oneItem}
    ${"with multiple items"} | ${multipleItems}
  `("returns $name via render props", ({ items }) => {
    const { queryByText } = setupComponent({ items, qa: stubQA });

    items.forEach((x: ExpandedItem) => {
      const item = queryByText(x.header);
      expect(item).toBeInTheDocument();
    });
  });

  test("returns empty array", () => {
    const { queryByText } = setupComponent({items:[], qa: stubQA});
    const headerText = queryByText(stubQA);

    expect(headerText).toBeNull();
  });
});
