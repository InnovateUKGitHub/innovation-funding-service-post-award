import TestBed, { TestBedContent } from "@shared/TestBed";
import { render } from "@testing-library/react";

import { EmailContent, EmailContentProps } from "@ui/components/emailContent";

describe("EmailContent", () => {
  const content = {
    projectDetails: {
      changeEmail: {
        content: "testbed@iuk.ukri.org",
      },
    },
  } as TestBedContent;
  const setup = (props?: Partial<EmailContentProps>) =>
    render(
      <TestBed content={content}>
        <EmailContent value={x => x.projectDetails.changeEmail} {...props} />
      </TestBed>,
    );

  describe("@renders", () => {
    test("should return as default", () => {
      const { container } = setup({ qa: "email-qa" });
      expect(container).toMatchSnapshot();
    });

    describe("should render href", () => {
      test("with default value", () => {
        const { getByRole } = setup();
        const expectedHref = `mailto:${content.projectDetails?.changeEmail.content}`;
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
      const { queryByRole } = setup({ value: undefined });
      expect(queryByRole("link")).toBe(null);
    });
  });
});
