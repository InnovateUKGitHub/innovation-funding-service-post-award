import React from "react";

import { ListItem, ListItemProps } from "../../../src/ui/components/layout/listItem";
import { render } from "@testing-library/react";

describe("ListItem", () => {
  const setup = (props?: Partial<ListItemProps>) => {
    const defaultProps = {
      children: <div>some child element</div>,
    };

    return render(<ListItem {...defaultProps} {...props} />);
  };

  describe("@renders", () => {
    describe("with className", () => {
      it("which has an actionRequired class", () => {
        const { container } = setup({ actionRequired: true });

        expect(container.firstChild).toHaveClass("acc-list-item__actionRequired");
      });

      it("with default classes", () => {
        const { container } = setup();

        expect(container.firstChild).not.toHaveClass("acc-list-item__actionRequired");
      });
    });

    it("with data-qa value", () => {
      const stubQa = "stub-qa";
      const { queryByTestId } = setup({ qa: stubQa });

      expect(queryByTestId(stubQa)).toBeTruthy();
    });

    it("with other props", () => {
      const stubTitle = "stub-title";
      const { getByTitle } = setup({ title: stubTitle });

      expect(getByTitle(stubTitle)).toBeTruthy();
    });
  });
});
