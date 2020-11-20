import { renderHook } from "@testing-library/react-hooks";
import { useExternalContent } from "@ui/components/layout/footer.config";
import { Content } from "../../../src/content";
import { hookTestBed } from "@shared/TestBed";

describe("Footer config", () => {
  describe("useExternalContent", () => {
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

      const { result } = renderHook(
        useExternalContent,
        hookTestBed({ content: stubContent })
      );

      return result.current;
    };

    it("should return with content", () => {
      const footerContent = setup();

      expect(footerContent).toMatchSnapshot();
    });
  });
});
