import { renderHook } from "@testing-library/react";
import { hookTestBed } from "@shared/TestBed";
import { footerLinks, useFooterExternalContent } from "@ui/containers/app/footer.config";
import { Content } from "@content/content";

describe("Footer config", () => {
  describe("footerLinks", () => {
    test("as default", () => {
      expect(footerLinks).toMatchSnapshot();
    });
  });

  describe("useFooterExternalContent", () => {
    const setup = () => {
      const stubContent = {
        footer: {
          supportLinks: { content: "stub-content-supportLinks" },
          explainCookies: { content: "stub-content-explainCookies" },
          cookieFindOutMore: { content: "stub-content-cookieFindOutMore" },
          govLicenseLinkPart1: { content: "stub-content-govLicenseLinkPart1" },
          govLicenseLinkPart2: { content: "stub-content-govLicenseLinkPart2" },
          govLicenseLinkPart3: { content: "stub-content-govLicenseLinkPart3" },
          crownCopyright: { content: "stub-content-crownCopyright" },
        },
      } as Partial<Content>;

      const { result } = renderHook(useFooterExternalContent, hookTestBed({ content: stubContent }));

      return result.current;
    };

    test("should return with content", () => {
      const footerContent = setup();

      expect(footerContent).toMatchSnapshot();
    });
  });
});
