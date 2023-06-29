import { render } from "@testing-library/react";
import { OL, UL, List, ListProps, PlainList } from "@ui/components/atomicDesign/atoms/List/list";

describe("UI Lists", () => {
  const requiredProps: ListProps = {
    children: <li>Yolo stub here!</li>,
  };

  describe("<List />", () => {
    const setup = (props?: Partial<ListProps>) => render(<List {...requiredProps} {...props} />);

    describe("@renders", () => {
      test("in default state without <li> symbol", () => {
        const { container } = setup();

        const targetElement = container.querySelector(".govuk-list");

        if (!targetElement) throw Error("No element found!");

        expect(targetElement).toBeInTheDocument();
        expect(targetElement).not.toHaveClass("govuk-list--bullet");
        expect(targetElement).not.toHaveClass("govuk-list--number");
        expect(targetElement).not.toHaveClass("govuk-list--plain");
      });

      test("with qa", () => {
        const stubQa = "stub-qa";
        const { queryByTestId } = setup({ qa: stubQa });

        const targetElement = queryByTestId(stubQa);
        expect(targetElement).toBeInTheDocument();
      });

      test("with className", () => {
        const stubClassName = "stub-className";
        const { container } = setup({ className: stubClassName });

        const targetElement = container.getElementsByClassName(stubClassName);
        expect(targetElement).toHaveLength(1);
      });

      describe("with children", () => {
        const oneChild = <li>a child</li>;
        const manyChildren = (
          <>
            <li>first child</li>
            <li>second child</li>
          </>
        );

        test.each`
          name                        | childrenProp    | totalChildrenCount
          ${"with one child"}         | ${oneChild}     | ${1}
          ${"with multiple children"} | ${manyChildren} | ${2}
        `("$name", ({ childrenProp, totalChildrenCount }) => {
          const { container } = setup({ children: childrenProp });

          const totalItems = container.querySelectorAll("li").length;
          expect(totalItems).toBe(totalChildrenCount);
        });
      });
    });
  });

  describe("<UL />", () => {
    test("returns correctly", () => {
      const { container } = render(<UL>{requiredProps.children}</UL>);

      const targetElement = container.querySelector(".govuk-list--bullet");

      expect(targetElement).toBeInTheDocument();
    });
  });

  describe("<OL />", () => {
    test("returns correctly", () => {
      const { container } = render(<OL>{requiredProps.children}</OL>);

      const targetElement = container.querySelector(".govuk-list--number");

      expect(targetElement).toBeInTheDocument();
    });
  });

  describe("<PlainList />", () => {
    test("returns correctly", () => {
      const { container } = render(<PlainList>{requiredProps.children}</PlainList>);

      const targetElement = container.querySelector(".govuk-list--plain");

      expect(targetElement).toBeInTheDocument();
    });
  });
});
