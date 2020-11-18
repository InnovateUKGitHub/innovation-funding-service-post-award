import React from "react";
import { render } from "@testing-library/react";

import { Email, EmailProps } from "../../../src/ui/components/renderers";

describe("Email", () => {
  const defaultProps: EmailProps = {
    children: "stub-children@email.com",
  };
  const setup = (props?: Partial<EmailProps>) => render(<Email {...defaultProps} {...props} />);

  describe("@renders", () => {
    test("should return as default", () => {
      const { container } = setup({ qa: "email-qa" });
      expect(container).toMatchSnapshot();
    });

    describe("should render href", () => {
      test("with default value", () => {
        const { getByRole } = setup();
        const expectedHref = `mailto:${defaultProps.children}`;
        const anchorEl = getByRole("link");
        expect(anchorEl).toHaveAttribute("href", expectedHref);
      });

      test("with provided href", () => {
        const { getByRole } = setup({ href: "predefinedhref@test.com" });
        const anchorEl = getByRole("link");
        expect(anchorEl.getAttribute("href")).toEqual("mailto:predefinedhref@test.com");
      });
    });

    test("with classname", () => {
      const { getByRole } = setup({ className: "customClass" });
      const anchorEl = getByRole("link");
      expect(anchorEl).toHaveClass("customClass");
    });

    test("with qa", () => {
      const { getByRole } = setup({ qa: "email-qa" });
      const anchorEl = getByRole("link");
      expect(anchorEl).toHaveAttribute("data-qa");
      expect(anchorEl.getAttribute("data-qa")).toBe("email-qa");
    });

    test("when empty should render null", () => {
      const { queryByRole } = setup({ children: "" });
      expect(queryByRole("link")).toBe(null);
    });
  });
});
