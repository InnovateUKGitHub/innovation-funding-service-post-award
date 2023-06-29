import { render } from "@testing-library/react";
import { Percentage, Props } from "./percentage";

describe("<Percentage />", () => {
  describe("@renders", () => {
    const setup = (props: Props) => render(<Percentage {...props} />);

    it("with no value", () => {
      const { container } = setup({ value: null });
      expect(container.firstChild).toBeNull();
    });

    it("without minus sign with -0.0", () => {
      const { queryByText } = setup({ value: -0.0 });
      const targetElement = queryByText("0.00%");
      expect(targetElement).toBeInTheDocument();
    });

    it("with 2 decimal places as default", () => {
      const { queryByText } = setup({ value: 100 });
      const targetElement = queryByText("100.00%");
      expect(targetElement).toBeInTheDocument();
    });

    it("with 5 decimal places", () => {
      const { queryByText } = setup({ value: 100, fractionDigits: 5 });
      const targetElement = queryByText("100.00000%");
      expect(targetElement).toBeInTheDocument();
    });
  });
});
