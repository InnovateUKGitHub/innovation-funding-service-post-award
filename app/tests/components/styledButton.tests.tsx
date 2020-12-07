import React from "react";
import { render } from "@testing-library/react";

import { Button, StyledButtonProps } from "../../src/ui/components";

describe("StyledButton", () => {
  const setup = (props: StyledButtonProps) => render(<Button {...props} />);

  describe("@renders", () => {
    test.each`
      name                                                        | props                       | expectedClasses
      ${"when a primary button when given a primary styling"}     | ${{ styling: "Primary" }}   | ${"govuk-button govuk-!-margin-right-1"}
      ${"when a secondary button when given a secondary styling"} | ${{ styling: "Secondary" }} | ${"govuk-button govuk-!-margin-right-1 govuk-button--secondary"}
      ${"when a warning button when given a warning styling"}     | ${{ styling: "Warning" }}   | ${"govuk-button govuk-!-margin-right-1 govuk-button--warning"}
      ${"when a link when given a link styling"}                  | ${{ styling: "Link" }}      | ${"govuk-link"}
      ${"when a button with no styling returns a default class"}  | ${{}}                       | ${"govuk-button govuk-!-margin-right-1"}
    `("$name", ({ props, expectedClasses }) => {
      const { container } = setup(props);
      expect(container.firstChild).toHaveClass(expectedClasses, { exact: true });
    });
  });
});
