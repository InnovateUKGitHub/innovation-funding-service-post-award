import React from "react";
import { mount } from "enzyme";

import { PageTitle, PageTitleProps } from "../../../src/ui/components/layout/pageTitle";
import { findByQa } from "../helpers/find-by-qa";
import TestBed, { ITestBedProps, stubStores } from "../helpers/TestBed";

describe("PageTitle", () => {
  const setup = (props?: PageTitleProps, stores?: ITestBedProps["stores"]) => {
    const wrapper = mount(
      <TestBed stores={stores}>
        <PageTitle {...props} />
      </TestBed>,
    );

    const titleElement = findByQa(wrapper, "page-title-value");
    const captionElement = findByQa(wrapper, "page-title-caption");

    return {
      wrapper,
      titleElement,
      captionElement,
    };
  };

  test.each`
    name                 | caption           | matches
    ${"with caption"}    | ${"stub-caption"} | ${"stub-caption"}
    ${"without caption"} | ${null}           | ${null}
  `("renders $name", ({ caption, matches }) => {
    const { captionElement } = setup({ caption });

    expect(captionElement.exists()).toBe(!!matches);

    if (matches) {
      expect(captionElement.text()).toBe(matches);
    }
  });

  test.each`
    name                                                              | title                | displayTitle            | matches
    ${"returns null if no valid title is set"}                        | ${""}                | ${""}                   | ${null}
    ${"returns title from props"}                                     | ${"stub-only-title"} | ${""}                   | ${"stub-only-title"}
    ${"returns title from props if defined rather than displayTitle"} | ${"stub-title"}      | ${"stub-fallbackTitle"} | ${"stub-title"}
    ${"returns displayTitle value when title is not defined"}         | ${""}                | ${"stub-getPageTitle"}  | ${"stub-getPageTitle"}
  `("$name", ({ title, displayTitle, matches }) => {
    const stubTestBedStore = {
      ...stubStores,
      navigation: {
        getPageTitle: () => ({
          displayTitle,
        }),
      },
    };

    const { titleElement } = setup({ title }, stubTestBedStore as any);

    if (matches) {
      expect(titleElement.text()).toBe(matches);
    } else {
      expect(titleElement.exists()).toBeFalsy();
    }
  });
});
