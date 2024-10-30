import { render } from "@testing-library/react";

import { Heading, HeadingProps } from "@ui/components/atoms/Heading/Heading";

describe("<Heading />", () => {
  const requiredProps: HeadingProps = {
    type: "h1",
    children: "content as string",
  };

  const setup = (props?: Partial<HeadingProps>) => render(<Heading {...requiredProps} {...props} />);

  describe("@returns", () => {
    test("as default", () => {
      const { container } = setup();

      const targetElement = container.firstChild;

      expect(targetElement).toBeInTheDocument();
    });

    describe("with content", () => {
      test("as string", () => {
        const stubContentAsString = "as string";
        const { queryByText } = setup({ children: stubContentAsString });

        const targetElement = queryByText(stubContentAsString);

        expect(targetElement).toBeInTheDocument();
      });

      test("as element", () => {
        const customNodeQa = "some-custom-heading-element";
        const stubContentAsElement = (
          <span data-qa={customNodeQa}>
            I have a <strong>bold</strong> content
          </span>
        );

        const { queryByTestId } = setup({ children: stubContentAsElement });
        const targetElement = queryByTestId(customNodeQa);

        expect(targetElement).toBeInTheDocument();
      });
    });

    test("with className", () => {
      const stubQa = "stub-className";
      const { queryByText } = setup({ className: stubQa });

      const targetElement = queryByText(requiredProps.children as string);

      expect(targetElement).toHaveClass(stubQa);
    });

    test("with qa", () => {
      const stubQa = "stub-qa";
      const { queryByTestId } = setup({ qa: stubQa });

      const targetElement = queryByTestId(stubQa);

      expect(targetElement).toBeInTheDocument();
    });

    test("with as", () => {
      const { container } = setup({ as: "h2" });

      const targetElement = container.querySelector("h2");

      expect(targetElement).toBeInTheDocument();
    });
  });
});
