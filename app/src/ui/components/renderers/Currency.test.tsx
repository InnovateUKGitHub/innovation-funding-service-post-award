import { render } from "@testing-library/react";
import { Currency, CurrencyProps } from "@ui/components/renderers/currency";

describe("<Currency />", () => {
  const setup = (props: CurrencyProps) => render(<Currency {...props} />);

  describe("@renders", () => {
    describe("with fractionDigits", () => {
      test("when at one decimal place", () => {
        const { queryByText } = setup({ fractionDigits: 1, value: 33.333333 });

        const targetElement = queryByText("£33.3");
        expect(targetElement).toBeInTheDocument();
      });

      test("when at the default two decimal places", () => {
        const { queryByText } = setup({ value: 22.22222 });

        const targetElement = queryByText("£22.22");
        expect(targetElement).toBeInTheDocument();
      });

      test("when at three decimal places", () => {
        const { queryByText } = setup({ fractionDigits: 3, value: 11.111111 });

        const targetElement = queryByText("£11.111");
        expect(targetElement).toBeInTheDocument();
      });
    });

    test.each`
      name                                             | inboundValue            | expectedValue
      ${"with null"}                                   | ${null}                 | ${"£0.00"}
      ${"with positive value with pence"}              | ${98.76}                | ${"£98.76"}
      ${"with positive value with pence"}              | ${98.76}                | ${"£98.76"}
      ${"with positive two digit number"}              | ${12}                   | ${"£12.00"}
      ${"with positive four digit number"}             | ${1234}                 | ${"£1,234.00"}
      ${"with negative value with pence"}              | ${-12.34}               | ${"-£12.34"}
      ${"with negative two digit number"}              | ${-98}                  | ${"-£98.00"}
      ${"with negative four digit number"}             | ${-9876}                | ${"-£9,876.00"}
      ${"with large number above a trillion"}          | ${4_123_456_789_999}    | ${"£4,123,456,789,999.00"}
      ${"with large number below a negative trillion"} | ${-999_999_999_999_999} | ${"-£999,999,999,999,999.00"}
    `("number below a trillion $name", ({ inboundValue, expectedValue }) => {
      const { queryByTestId } = setup({ qa: "testbed-currency", value: inboundValue });

      const targetValue = queryByTestId("testbed-currency");
      expect(targetValue).toBeInTheDocument();
      expect(targetValue).toHaveTextContent(expectedValue);
      expect(targetValue).toMatchSnapshot();
    });

    describe("with className", () => {
      test("when valid", () => {
        const stubClassName = "stub-stubClassName";
        const { container } = setup({ value: 20, className: stubClassName });

        const targetElement = container.querySelector(`.${stubClassName}`);
        expect(targetElement).toBeInTheDocument();
      });

      test("when invalid", () => {
        const stubClassName = false;
        const { container } = setup({ value: 20, className: stubClassName });

        const target = container.querySelector(".currency");

        if (!target) {
          throw Error("Currency element found!");
        }

        expect(target.classList).toHaveLength(1);
      });
    });

    describe("with inline styles", () => {
      test("with default whiteSpace", () => {
        const { container } = setup({ value: 20 });

        const target = container.querySelector(".currency");

        if (!target) {
          throw Error("Currency element found!");
        }

        expect(target).toHaveStyle("white-space: nowrap");
      });

      test("with additional whiteSpace style", () => {
        const stubWhiteSpaceValue = "pre-wrap";
        const { container } = setup({ value: 20, style: { whiteSpace: stubWhiteSpaceValue } });

        const target = container.querySelector(".currency");

        if (!target) {
          throw Error("Currency element found!");
        }

        expect(target).toHaveStyle("white-space: nowrap");
        expect(target).not.toHaveStyle(`white-space: ${stubWhiteSpaceValue}`);
      });

      test("with additional styles", () => {
        const { container } = setup({ value: 20, style: { opacity: 1 } });

        const target = container.querySelector(".currency");

        if (!target) {
          throw Error("Currency element found!");
        }

        expect(target).toHaveStyle("white-space: nowrap");
        expect(target).toHaveStyle("opacity: 1");
      });
    });
  });
});
