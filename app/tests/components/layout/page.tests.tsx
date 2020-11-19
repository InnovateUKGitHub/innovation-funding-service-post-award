import React from "react";
// tslint:disable-next-line: import-blacklist
import { mount } from "enzyme";
import { PartnerStatus, ProjectStatus } from "@framework/dtos";
import { ErrorCode, IAppError } from "@framework/types";
import { Results } from "@ui/validation";

import { Page, PageProps } from "../../../src/ui/components/layout/page";
import { findByQa } from "../helpers/find-by-qa";
import TestBed from "../helpers/TestBed";

describe("<Page />", () => {
  const defaultProps = {
    pageTitle: <h1>stub-pageTitle</h1>,
    children: <p>stub-children</p>,
  };

  const setup = (props?: Partial<PageProps>) => {
    const stubContent = {
      components: {
        errorSummary: {
          errorTitle: { content: "stub-errorTitle" },
          expiredMessageContent: { content: "stub-expiredMessageContent" },
          unsavedWarningContent: { content: "stub-unsavedWarningContent" },
          somethingGoneWrongContent: {
            content: "stub-somethingGoneWrongContent",
          },
        },
      },
    };
    const wrapper = mount(<TestBed content={stubContent as any}><Page {...defaultProps} {...props} /></TestBed>);
    const holdMessageElement = findByQa(wrapper, "on-hold-info-message");
    const backlinkElement = findByQa(wrapper, "page-backlink");
    const pageErrorElement = findByQa(wrapper, "error-summary");
    const validationSummaryElement = wrapper.find("ValidationSummary");

    return {
      wrapper,
      holdMessageElement,
      backlinkElement,
      pageErrorElement,
      validationSummaryElement,
    };
  };

  it("renders in default state", () => {
    const { wrapper, pageErrorElement, backlinkElement, holdMessageElement } = setup();

    // Note: I want to match against a string not nodes
    const titleContent = defaultProps.pageTitle.props.children;
    const childrenContent = defaultProps.children.props.children;

    const renderedHtml = wrapper.html();

    // Note: since we have no data-qa, we just delve into the ReactElement children and cross check the rendered html
    expect(renderedHtml).toContain(titleContent);
    expect(renderedHtml).toContain(childrenContent);

    // Note: no prop no dice!
    expect(pageErrorElement.exists()).toBe(false);
    expect(backlinkElement.exists()).toBe(false);
    expect(holdMessageElement.exists()).toBe(false);
  });

  it("should render a back link", () => {
    const { backlinkElement } = setup({ backLink: <div>backlink element</div> });

    expect(backlinkElement.exists()).toBe(true);
  });

  it("should render an <ErrorSummary />", () => {
    const stubAppError: IAppError = {
      code: ErrorCode.BAD_REQUEST_ERROR,
      message: "stub-message",
      results: null,
    };

    const { pageErrorElement } = setup({ error: stubAppError });

    expect(pageErrorElement.exists()).toBe(true);
  });

  describe("should render a <ValidationSummary />", () => {
    const stubResult: Results<{}> = new Results({}, false);

    it("when validations is a single item", () => {
      const singleValidation: PageProps["validator"] = stubResult;
      const { validationSummaryElement } = setup({ validator: singleValidation });

      expect(validationSummaryElement.exists()).toBe(true);
    });
    it("when validations is an array", () => {
      const arrayOfValidations: PageProps["validator"] = [stubResult, stubResult];
      const { validationSummaryElement } = setup({ validator: arrayOfValidations });

      expect(validationSummaryElement.exists()).toBe(true);
    });
  });

  describe("renders a hold message", () => {
    test.each`
      name                | props                                                          | expectedMessage
      ${"with a project"} | ${{ project: { status: ProjectStatus.OnHold } as any }}        | ${"This project is on hold. Contact Innovate UK for more information."}
      ${"with a partner"} | ${{ partner: { partnerStatus: PartnerStatus.OnHold } as any }} | ${"Partner is on hold. Contact Innovate UK for more information."}
    `("$name on hold", ({ props, expectedMessage }) => {
      const { holdMessageElement } = setup(props);

      expect(holdMessageElement.text()).toContain(expectedMessage);
    });
  });
});
