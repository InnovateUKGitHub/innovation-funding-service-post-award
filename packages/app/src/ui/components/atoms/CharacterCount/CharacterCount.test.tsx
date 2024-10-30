import TestBed from "@shared/TestBed";
import { render } from "@testing-library/react";

import { CharacterCount, CharacterCountProps } from "./CharacterCount";

const renderCount = (props: CharacterCountProps) => {
  return render(
    <TestBed>
      <CharacterCount {...props} />
    </TestBed>,
  );
};

describe("<CharacterCount />", () => {
  const hasStyleQuery = (queryContainer: Element, hasError: boolean) => {
    const targerClassName = hasError ? "character-count--error" : "character-count--default";
    return queryContainer.querySelector(targerClassName);
  };

  describe("@renders", () => {
    describe("with ascending", () => {
      const ascendingBaseProps: CharacterCountProps = {
        children: <div>stub-children</div>,
        count: 0,
        type: "ascending",
      };

      test("with singular spelling", () => {
        const ascendingProps = { ...ascendingBaseProps, count: 1 };

        const { queryByText } = renderCount(ascendingProps);

        const singluarMessage = queryByText("You have 1 character");

        expect(singluarMessage).toBeInTheDocument();
      });

      test("with plural spelling", () => {
        const ascendingProps = { ...ascendingBaseProps, count: 2 };

        const { queryByText } = renderCount(ascendingProps);

        const pluralMessage = queryByText("You have 2 characters");

        expect(pluralMessage).toBeInTheDocument();
      });

      test("with default count (without limit)", () => {
        const ascendingProps = { ...ascendingBaseProps, count: 0 };

        const { queryByText } = renderCount(ascendingProps);

        const startingCountMessage = queryByText("You have 0 characters");

        expect(startingCountMessage).toBeInTheDocument();
      });

      describe("with correct styling", () => {
        test.each`
          name                            | count | minValue     | expectedHasError
          ${"with no minimum"}            | ${0}  | ${undefined} | ${false}
          ${"with no minimum with count"} | ${1}  | ${undefined} | ${false}
          ${"with below minimum"}         | ${1}  | ${2}         | ${true}
          ${"with matching minimum"}      | ${1}  | ${1}         | ${false}
          ${"with over minimum"}          | ${2}  | ${1}         | ${false}
        `("$name", ({ count, minValue, expectedHasError }) => {
          const ascendingProps = { ...ascendingBaseProps, count, minValue };

          const { container } = renderCount(ascendingProps);

          const uiState = hasStyleQuery(container, expectedHasError);

          expect(uiState).toBeDefined();
        });
      });

      describe("with minimum value", () => {
        test("with required count", () => {
          const stubCount = 10;
          const ascendingProps = { ...ascendingBaseProps, count: 0, minValue: stubCount };

          const { queryByText } = renderCount(ascendingProps);

          const startingCountMessage = queryByText(`You have ${stubCount} characters required`);

          expect(startingCountMessage).toBeInTheDocument();
        });

        test("with achieved count", () => {
          const stubMinValue = 10;
          const stubCount = stubMinValue + 1;

          const ascendingProps = { ...ascendingBaseProps, count: stubCount, minValue: stubCount };

          const { queryByText } = renderCount(ascendingProps);

          const startingCountMessage = queryByText(`You have ${stubCount} characters`);

          expect(startingCountMessage).toBeInTheDocument();
        });

        test("with unachieved count", () => {
          const stubMinValue = 10;
          const stubCount = stubMinValue / 2;

          const ascendingProps = { ...ascendingBaseProps, count: stubCount, minValue: stubCount };

          const { queryByText } = renderCount(ascendingProps);

          const startingCountMessage = queryByText(`You have ${stubMinValue - stubCount} characters`);

          expect(startingCountMessage).toBeInTheDocument();
        });
      });
    });

    describe("with decesending", () => {
      const descendingBaseProps: CharacterCountProps = {
        children: <div>stub-children</div>,
        count: 0,
        maxValue: 10,
        type: "descending",
      };

      test("with singular spelling", () => {
        const descendingProps = { ...descendingBaseProps, count: 1, maxValue: 2 };

        const { queryByText } = renderCount(descendingProps);

        const singluarMessage = queryByText("You have 1 character remaining");

        expect(singluarMessage).toBeInTheDocument();
      });

      test("with plural spelling", () => {
        const descendingProps = { ...descendingBaseProps, count: 2, maxValue: 4 };

        const { queryByText } = renderCount(descendingProps);

        const pluralMessage = queryByText("You have 2 characters remaining");

        expect(pluralMessage).toBeInTheDocument();
      });

      test("with single starting maximum count", () => {
        const descendingProps = { ...descendingBaseProps, count: 0, maxValue: 1 };

        const { queryByText, container } = renderCount(descendingProps);

        const defaultStyle = hasStyleQuery(container, false);
        const startingCountMessage = queryByText("You have 1 character remaining");

        expect(defaultStyle).toBeDefined();
        expect(startingCountMessage).toBeInTheDocument();
      });

      test("with plural starting maximum count", () => {
        const descendingProps = { ...descendingBaseProps, count: 0, maxValue: 2 };

        const { queryByText, container } = renderCount(descendingProps);

        const defaultStyle = hasStyleQuery(container, false);
        const startingCountMessage = queryByText("You have 2 characters remaining");

        expect(defaultStyle).toBeDefined();
        expect(startingCountMessage).toBeInTheDocument();
      });

      describe("with correct styling", () => {
        test.each`
          name                       | count | maxValue | expectedHasError
          ${"with below maximum"}    | ${0}  | ${1}     | ${false}
          ${"with matching maximum"} | ${1}  | ${1}     | ${false}
          ${"with above maximum"}    | ${2}  | ${1}     | ${true}
        `("$name", ({ count, maxValue, expectedHasError }) => {
          const ascendingProps = { ...descendingBaseProps, count, maxValue };

          const { container } = renderCount(ascendingProps);

          const uiState = hasStyleQuery(container, expectedHasError);

          expect(uiState).toBeDefined();
        });
      });

      describe("with maximum value", () => {
        test("with remaining count", () => {
          const stubMaxValue = 15;
          const descendingProps = { ...descendingBaseProps, count: 0, maxValue: stubMaxValue };

          const { queryByText } = renderCount(descendingProps);

          const startingCountMessage = queryByText("You have 15 characters remaining");

          expect(startingCountMessage).toBeInTheDocument();
        });

        test("with achieved count", () => {
          const stubCount = 10;
          const descendingProps = { ...descendingBaseProps, count: stubCount, maxValue: stubCount };

          const { queryByText } = renderCount(descendingProps);

          const startingCountMessage = queryByText("You have 0 characters remaining");

          expect(startingCountMessage).toBeInTheDocument();
        });

        test("with unachieved count - singular", () => {
          const stubMaxValue = 10;
          const stubCount = stubMaxValue + 1;

          const descendingProps = { ...descendingBaseProps, count: stubCount, maxValue: stubMaxValue };

          const { queryByText } = renderCount(descendingProps);

          const startingCountMessage = queryByText("You have 1 character too many");

          expect(startingCountMessage).toBeInTheDocument();
        });

        test("with unachieved count - plural", () => {
          const stubMaxValue = 10;
          const stubCount = stubMaxValue + 2;

          const descendingProps = { ...descendingBaseProps, count: stubCount, maxValue: stubMaxValue };

          const { queryByText } = renderCount(descendingProps);

          const startingCountMessage = queryByText("You have 2 characters too many");

          expect(startingCountMessage).toBeInTheDocument();
        });
      });
    });
  });
});
