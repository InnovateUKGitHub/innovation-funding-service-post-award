import { PossibleCopyFunctions } from "@copy/type";
import { hookTestBed } from "@shared/TestBed";
import { initStubTestIntl } from "@shared/initStubTestIntl";
import { renderHook } from "@testing-library/react";
import { noop } from "@ui/helpers/noop";
import { useContent } from "./content.hook";

describe("useContent()", () => {
  const stubTestContent = {
    example: {
      contentTitle: "Microsoft Teams",
      content_one: "You have {{count}} {{name}} message.",
      content_other: "You have {{count}} {{name}} messages.",
    },
  };

  type PossibleTestCopyKeys = typeof stubTestContent;
  type PossibleTestCopyFunctions = PossibleCopyFunctions<PossibleTestCopyKeys>;

  const render = renderHook(useContent, hookTestBed({}));

  beforeAll(async () => {
    await initStubTestIntl(stubTestContent);
  });

  test("should throw error without provider", () => {
    // Note: RTL throws the error even though we catch it with the jest expect. This removes the console.error cli noise
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(noop);

    // Note: renderHook() is not used here, I do not want a provider as I want to test error
    expect(() => renderHook(() => useContent())).toThrow("useContent() must be used within a <ContentProvider />");
    consoleSpy.mockRestore();
  });

  test.each`
    name                                           | contentSelector                                                                      | result
    ${"valid string input"}                        | ${"example.contentTitle"}                                                            | ${"Microsoft Teams"}
    ${"valid content selector"}                    | ${(x: PossibleTestCopyFunctions) => x.example.contentTitle}                          | ${"Microsoft Teams"}
    ${"valid content selector with singular data"} | ${(x: PossibleTestCopyFunctions) => x.example.content({ count: 1, name: "Teams" })}  | ${"You have 1 Teams message."}
    ${"valid content selector with plural data"}   | ${(x: PossibleTestCopyFunctions) => x.example.content({ count: 12, name: "Slack" })} | ${"You have 12 Slack messages."}
  `("should return content with $name", ({ contentSelector, result }) => {
    const { getContent } = render.result.current;

    expect(getContent(contentSelector)).toBe(result);
  });
});
