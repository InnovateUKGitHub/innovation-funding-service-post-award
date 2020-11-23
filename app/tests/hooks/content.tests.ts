import { renderHook } from "@testing-library/react-hooks";
import { hookTestBed } from "@shared/TestBed";
import { ContentResult } from "@content/contentBase";
import { getContentFromResult, useContent } from "@ui/hooks";

describe("getContentFromResult()", () => {
  it("should get content from result", () => {
    const stubResult: ContentResult = {
      key: "stub-key",
      content: "stub-content",
      markdown: false,
    };

    const result = getContentFromResult(stubResult);

    expect(result).toBe(stubResult.content);
  });
});

describe("useContent()", () => {
  const stubTestContent = {
    test1: {
      content: "stub-test2",
    },
    test2: {
      content: "stub-test2",
    },
  };

  const render = (testContent?: object) => renderHook(useContent, hookTestBed({ content: testContent }));

  it("should throw error without provider", () => {
    // Note: render() is not used here, I do not want a provider as I want to test error
    const { result } = renderHook(() => useContent());

    expect(result.error).toEqual(Error("useContent() must be used within a <ContentProvider />"));
  });

  it("should return content", () => {
    const { result } = render(stubTestContent);

    expect(result.current.content).toStrictEqual(stubTestContent);
  });

  describe("with getContent()", () => {
    it("using a ContentSelector", () => {
      const stubContent = {
        header: {
          dashboard: {
            content: "stub-dashboard",
          },
        },
      };

      const { getContent } = render(stubContent).result.current;

      expect(getContent((x) => x.header.dashboard)).toBe(stubContent.header.dashboard.content);
    });

    it("using a string", () => {
      const stubContentString = "some-content";
      const { getContent } = render().result.current;

      expect(getContent(stubContentString)).toBe(stubContentString);
    });
  });

  it("should return getResultByQuery", () => {
    const stubContent = {
      header: {
        profile: {
          key: "stub-profile-key",
          content: "stub-profile-content",
          markdown: false,
        },
      },
    };

    const { getResultByQuery } = render(stubContent).result.current;

    const content = getResultByQuery((x) => x.header.profile);

    expect(content.key).toBe(stubContent.header.profile.key);
    expect(content.content).toBe(stubContent.header.profile.content);
    expect(content.markdown).toBe(stubContent.header.profile.markdown);
  });

  it("should return getContentFromResult", () => {
    const stubContent = {
      header: {
        profile: {
          key: "stub-profile-key",
          content: "stub-profile-content",
          markdown: false,
        },
      },
    };

    const { current } = render().result;

    const content = current.getContentFromResult(stubContent.header.profile);

    expect(content).toBe(stubContent.header.profile.content);
  });
});
