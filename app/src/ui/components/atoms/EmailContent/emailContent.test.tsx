import { CopyContentInvalidInputKeyError } from "@copy/Copy";
import TestBed from "@shared/TestBed";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { render } from "@testing-library/react";
import { EmailContent, EmailContentProps } from "@ui/components/atoms/EmailContent/emailContent";

describe("EmailContent", () => {
  beforeAll(async () => {
    await initStubTestIntl({
      pages: {
        projectDetails: {
          changeEmail: "testbed@iuk.ukri.org",
        },
      },
    });
  });

  afterAll(jest.restoreAllMocks);

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
      jest.spyOn(console, "error").mockImplementation();
      jest.spyOn(console, "info").mockImplementation();
      expect(() => {
        setup({ value: undefined });
      }).toThrow(CopyContentInvalidInputKeyError);
    });
  });
});
