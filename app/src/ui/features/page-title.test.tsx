import { render } from "@testing-library/react";
import TestBed from "@shared/TestBed";
import { PageTitle, PageTitleProps } from "./page-title";

describe("<PageTitle />", () => {
  const setup = (props?: PageTitleProps, contextTitle?: string) => {
    const results = render(
      <TestBed pageTitle={contextTitle}>
        <PageTitle {...props} />
      </TestBed>,
    );

    const captionElementQa = "page-title-caption";

    return {
      ...results,
      captionElementQa,
    };
  };

  describe("@renders", () => {
    describe("with caption", () => {
      test("when defined", () => {
        const stubCaptionText = "stub-caption-content";
        const { queryByTestId, captionElementQa } = setup({ caption: stubCaptionText });

        expect(queryByTestId(captionElementQa)).toBeInTheDocument();
      });

      test("when not set", () => {
        const { queryByTestId, captionElementQa } = setup({ caption: "" });

        expect(queryByTestId(captionElementQa)).not.toBeInTheDocument();
      });
    });

    describe("with title", () => {
      test.each`
        name                                         | title                  | contextTitle
        ${"returns title prop"}                      | ${"stub-only-title"}   | ${""}
        ${"returns title prop in favour of context"} | ${"stub-favour-title"} | ${"stub-custom-context-title"}
      `("$name", ({ title, contextTitle }) => {
        const { queryByText } = setup({ title }, contextTitle);
        const titleValue = queryByText(title);

        expect(titleValue).toBeInTheDocument();
      });

      test("returns context title when title prop is not defined", () => {
        const stubContextTitle = "stub-context-title";

        const { queryByText } = setup({ title: "" }, stubContextTitle);
        const titleValue = queryByText(stubContextTitle);

        expect(titleValue).toBeInTheDocument();
      });
    });

    test("should display both title and caption", () => {
      const stubTitleText = "stub-title-content";
      const { queryByText, queryByTestId, captionElementQa } = setup({
        title: stubTitleText,
        caption: "stub-caption-content",
      });

      expect(queryByText(stubTitleText)).toBeInTheDocument();
      expect(queryByTestId(captionElementQa)).toBeInTheDocument();
    });

    test("should render null when title is empty", () => {
      const { container } = setup({ title: "" }, "");

      expect(container.firstChild).toBeNull();
    });
  });
});
