import { renderHook } from "@testing-library/react";
import { hookTestBed } from "@shared/TestBed";
import { footerLinks, useFooterExternalContent } from "@ui/containers/app/footer.config";
import { testInitialiseInternationalisation } from "@shared/testInitialiseInternationalisation";

describe("Footer config", () => {
  const stubContent = {
    site: {
      footer: {
        supportLinks: "stub-content-supportLinks",
        explainCookies: "stub-content-explainCookies",
        cookieFindOutMore: "stub-content-cookieFindOutMore",
        externalLinkText: {
          part1: "stub-content-govLicenseLinkPart1",
          part2LinkText: "stub-content-govLicenseLinkPart2",
          part2: "stub-content-govLicenseLinkPart3",
        },
        crownCopyright: "stub-content-crownCopyright",
      },
    },
  };

  beforeAll(async () => {
    testInitialiseInternationalisation(stubContent);
  });

  describe("footerLinks", () => {
    test("as default", () => {
      expect(footerLinks).toMatchSnapshot();
    });
  });

  describe("useFooterExternalContent", () => {
    const setup = () => {
      const { result } = renderHook(useFooterExternalContent, hookTestBed({}));

      return result.current;
    };

    test("should return with content", () => {
      const footerContent = setup();

      expect(footerContent).toMatchSnapshot();
    });
  });
});
