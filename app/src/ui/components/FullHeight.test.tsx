import { render } from "@testing-library/react";
import { FullHeight } from "@ui/components";

describe("FullHeight Components", () => {
  const requiredProps = {
    children: <p>stub content</p>,
  };

  describe("<FullHeight.Container />", () => {
    describe("@renders", () => {
      test("as default", () => {
        const { container } = render(<FullHeight.Container {...requiredProps} />);

        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });

  describe("<FullHeight.Content />", () => {
    describe("@renders", () => {
      test("as default", () => {
        const { container } = render(<FullHeight.Content {...requiredProps} />);

        expect(container.firstChild).toMatchSnapshot();
      });
    });
  });
});
