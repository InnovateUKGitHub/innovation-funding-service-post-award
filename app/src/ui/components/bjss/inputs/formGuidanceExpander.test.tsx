import { render } from "@testing-library/react";
import TestBed from "@shared/TestBed";
import { FormGuidanceExpander, FormGuidanceExpanderProps } from "@ui/components/bjss/inputs/formGuidanceExpander";

const stubItems = [
  { header: "stub-title1", description: "stub-description1" },
  { header: "stub-title2", description: "stub-description2" },
  { header: "stub-title3", description: "stub-description3" },
];

const stubTitleHeader = "stubTitleHeader";
const hasDetailsQa = "hasDetailsQa";

describe("<FormGuidanceExpander />", () => {
  const setupComponent = (props: FormGuidanceExpanderProps) =>
    render(
      <TestBed>
        <FormGuidanceExpander {...props} />
      </TestBed>,
    );

  test("returns with list", () => {
    const oneItemList = stubItems.splice(0, 1);
    const { queryByText } = setupComponent({ title: stubTitleHeader, items: oneItemList, qa: hasDetailsQa });

    const item = queryByText(oneItemList[0].header);
    expect(item).toBeInTheDocument();
  });

  test("returns without list", () => {
    const withoutList: FormGuidanceExpanderProps["items"] = [];
    const { queryByTestId } = setupComponent({
      title: stubTitleHeader,
      items: withoutList,
      qa: hasDetailsQa,
    });

    const item = queryByTestId("form-guidance-list");

    expect(item).not.toBeInTheDocument();
  });

  test("returns the given component title", () => {
    const newTitle = "newTitle";
    const { queryByText } = setupComponent({
      title: newTitle,
      items: stubItems,
      qa: hasDetailsQa,
    });

    const item = queryByText(newTitle);
    expect(item).toBeInTheDocument();
  });

  test("renders data-qa value", () => {
    const stubQa = "stub-qa";
    const { queryByTestId } = setupComponent({
      title: stubTitleHeader,
      items: stubItems,
      qa: stubQa,
    });

    expect(queryByTestId(stubQa)).toBeTruthy();
  });
});
