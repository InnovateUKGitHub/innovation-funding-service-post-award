import React from "react";
import { render } from "@testing-library/react";

import { PageTitle, PageTitleProps } from "../../../src/ui/components/layout/pageTitle";
import TestBed, { stubStores, TestBedStore } from "@shared/TestBed";

describe("<PageTitle />", () => {
  const setup = (props?: PageTitleProps, stores?: TestBedStore) => {
    const results = render(
      <TestBed stores={stores}>
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
        const stubTestBedStore = {
          ...stubStores,
          navigation: {
            getPageTitle: () => ({
              displayTitle: contextTitle,
            }),
          },
        } as TestBedStore;

        const { queryByText } = setup({ title }, stubTestBedStore);
        const titleValue = queryByText(title);

        expect(titleValue).toBeInTheDocument();
      });

      test("returns context title when title prop is not defined", () => {
        const stubContextTitle = "stub-context-title";
        const stubTestBedStore = {
          ...stubStores,
          navigation: {
            getPageTitle: () => ({
              displayTitle: stubContextTitle,
            }),
          },
        } as TestBedStore;

        const { queryByText } = setup({ title: "" }, stubTestBedStore);
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
      const stubTestBedStore = {
        ...stubStores,
        navigation: {
          getPageTitle: () => ({
            displayTitle: "",
          }),
        },
      };

      const { container } = setup(
        {
          title: "",
        },
        stubTestBedStore as TestBedStore,
      );

      expect(container).toBeEmpty();
    });
  });
});
