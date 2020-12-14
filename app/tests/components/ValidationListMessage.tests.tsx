import React from "react";
import { render } from "@testing-library/react";

import { ValidationListMessage, ValidationListMessageProps } from "@ui/components/ValidationListMessage";

describe("<ValidationListMessage />", () => {
  const defaultProps = {
    before: "stub-before",
  };

  const setup = (props?: Partial<ValidationListMessageProps>) => {
    return render(<ValidationListMessage {...defaultProps} {...props} />);
  };

  describe("@renders", () => {
    test("with no items", () => {
      const { container } = setup();

      expect(container.firstChild).toBeNull();
    });

    test("with after", () => {
      const stubAfter = "stub-after";
      const { queryByText } = setup({
        after: stubAfter,
        items: ["required-so-null-does-not-show"],
      });

      expect(queryByText(stubAfter)).toBeInTheDocument();
    });

    test("with items", () => {
      const stubItem = "stub-item";

      const { queryByText } = setup({
        items: [stubItem],
      });

      expect(queryByText(stubItem)).toBeInTheDocument();
    });

    test("with multiple items", () => {
      const stubItem1 = "stub-item-1";
      const stubItem2 = "stub-item-2";

      const { queryByText } = setup({
        items: [stubItem1, stubItem2],
      });

      expect(queryByText(stubItem1)).toBeInTheDocument();
      expect(queryByText(stubItem2)).toBeInTheDocument();
    });
  });
});
