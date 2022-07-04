import { render } from "@testing-library/react";
import TestBed from "@shared/TestBed";
import { DetailContentList, DetailContentListProps } from "@ui/components/inputs/detailContentList";
import { ExpandedItem } from "@ui/components/inputs/formGuidanceExpander";

const stubItems = [
  { header: "stub-title1", description: "stub-description1" },
  { header: "stub-title2", description: "stub-description2" },
  { header: "stub-title3", description: "stub-description3" },
] as ExpandedItem[];

describe("<DetailContentList />", () => {
  const defaultProps = {
    qa: "stub-qa",
    items: []
  };

  const setupComponent = (props: Partial<DetailContentListProps>) =>
    render(
      <TestBed>
        <DetailContentList {...defaultProps} {...props} />
      </TestBed>,
    );

  const oneItem = stubItems.splice(0, 1);
  const multipleItems = stubItems.splice(0, 2);

  test.each`
    name                     | items
    ${"with one item"}       | ${oneItem}
    ${"with multiple items"} | ${multipleItems}
  `("returns $name via render props", ({ items }) => {
    const { queryByText } = setupComponent({ items });

    items.forEach((x: ExpandedItem) => {
      const item = queryByText(x.header);
      expect(item).toBeInTheDocument();
    });
  });

  test("returns empty array", () => {
    const emptyArrayQA = "stub-emptyArrayQA";
    const { queryByText } = setupComponent({ items: [], qa: emptyArrayQA });
    const headerText = queryByText(emptyArrayQA);

    expect(headerText).not.toBeInTheDocument();
  });
});
