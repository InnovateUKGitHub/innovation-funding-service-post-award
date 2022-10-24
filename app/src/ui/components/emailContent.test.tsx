import { CopyContentInvalidInputKeyError } from "@copy/Copy";
import TestBed from "@shared/TestBed";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";
import { render } from "@testing-library/react";
import { EmailContent, EmailContentProps } from "@ui/components/emailContent";

describe("EmailContent", () => {
  beforeAll(async () => {
    await testInitialiseInternationalisation({
      pages: {
        projectDetails: {
          changeEmail: "testbed@iuk.ukri.org",
        },
      },
    });
  });

  const setup = (props?: Partial<EmailContentProps>) =>
    render(
      <TestBed>
        <EmailContent value={x => x.pages.projectDetails.changeEmail} {...props} />
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
        const anchorEl = getByRole("link");
        expect(anchorEl).toHaveAttribute("href", "mailto:testbed@iuk.ukri.org");
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

    test("when empty should crash for invalid ContentSelector", () => {
      expect(() => {
        setup({ value: undefined });
      }).toThrow(CopyContentInvalidInputKeyError);
    });
  });
});
