import React from "react";
import { GovWidthContainer, GovWidthContainerProps } from "@ui/components";
import { render } from "@testing-library/react";

describe("<GovWidthContainer />", () => {
  const stubChildrenText = "stub content";
  const defaultProps = {
    children: <p>{stubChildrenText}</p>,
  };

  const setup = (props?: Partial<GovWidthContainerProps>) => render(<GovWidthContainer {...defaultProps} {...props} />);

  describe("@renders", () => {
    test("with default content", () => {
      const { queryByText } = setup();

      expect(queryByText(stubChildrenText)).toBeInTheDocument();
    });

    test("with className", () => {
      const stubClassName = "stub-className";
      const { container } = setup({ className: stubClassName });

      const childrenNode = container.querySelector(`.${stubClassName}`);

      expect(childrenNode).toBeInTheDocument();
    });

    test("with other prop", () => {
      const stubTitleValue = "stub-title-value";
      const { queryByTitle } = setup({ title: stubTitleValue });

      expect(queryByTitle(stubTitleValue)).toBeInTheDocument();
    });
  });
});
