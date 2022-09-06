import { renderHook } from "@testing-library/react";
import { hookTestBed } from "@shared/TestBed";
import { ContentResult } from "@content/contentBase";
import { Content } from "@content/content";
import { getContentFromResult, useContent } from "@ui/hooks";
import { noop } from "@ui/helpers/noop";

describe("getContentFromResult()", () => {
  test("should get content from result", () => {
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
    test1: { content: "stub-test1" },
    test2: { content: "stub-test2" },
  };

  const render = (testContent = {}) => renderHook(useContent, hookTestBed({ content: testContent }));

  test("should throw error without provider", () => {
    // Note: RTL throws the error even though we catch it with the jest expect. This removes the console.error cli noise
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(noop);

    // Note: renderHook() is not used here, I do not want a provider as I want to test error
    expect(() => renderHook(() => useContent())).toThrowError("useContent() must be used within a <ContentProvider />");
    consoleSpy.mockRestore();
  });

  test("should return content", () => {
    const { result } = render(stubTestContent);

    expect(result.current.content).toStrictEqual(stubTestContent);
  });

  describe("with getContent()", () => {
    describe("using a ContentSelector", () => {
      test("with valid query", () => {
        const stubContent = {
          header: {
            dashboard: {
              content: "stub-dashboard",
            },
          },
        };

        const { getContent } = render(stubContent).result.current;

        expect(getContent(x => x.header.dashboard)).toBe(stubContent.header.dashboard.content);
      });

      test("with missing nested property", () => {
        const stubContent = {
          header: {},
        };

        const { getContent } = render(stubContent).result.current;

        const stubQuery = (x: Content) => x.header.dashboard;

        const contentError = () => getContent(stubQuery);

        expect(contentError).toThrow(
          `It appears 'dashboard' is not available within the 'header' property. There is a problem with your available content object. Query => ${stubQuery.toString()}`,
        );
      });

      test("with missing parent property", () => {
        const { getContent } = render().result.current;

        const stubQuery = (x: Content) => x.header.dashboard;

        const contentError = () => getContent(stubQuery);

        expect(contentError).toThrow(`It appears the following query did not find a result -> ${stubQuery.toString()}`);
      });
    });

    test("using a string", () => {
      const stubContentString = "some-content";
      const { getContent } = render().result.current;

      expect(getContent(stubContentString)).toBe(stubContentString);
    });
  });

  test("should return getResultByQuery", () => {
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

    const content = getResultByQuery(x => x.header.profile);

    expect(content.key).toBe(stubContent.header.profile.key);
    expect(content.content).toBe(stubContent.header.profile.content);
    expect(content.markdown).toBe(stubContent.header.profile.markdown);
  });

  test("should return getContentFromResult", () => {
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
