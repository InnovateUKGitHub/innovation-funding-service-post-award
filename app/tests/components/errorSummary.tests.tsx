import React from "react";
import { mount } from "enzyme";
import { ErrorSummary, ErrorSummaryProps } from "@ui/components";
import { findByQa } from "./helpers/find-by-qa";
import { ErrorCode } from "@framework/types";
import TestBed from "./helpers/TestBed";

describe("<ErrorSummary />", () => {
  const unAuthenticatedError: ErrorSummaryProps = { code: ErrorCode.UNAUTHENTICATED_ERROR };
  const unUnknownError: ErrorSummaryProps = { code: ErrorCode.UNKNOWN_ERROR };

  const stubContent = {
    components: {
      errorSummary: {
        errorTitle: {
          content: "stub-errorContent",
        },
        expiredMessageContent: {
          content: "stub-expiredMessageContent",
        },
        unsavedWarningContent: {
          content: "stub-unsavedWarningContent",
        },
        somethingGoneWrongContent: {
          content: "stub-somethingGoneWrongContent",
        },
      },
    },
  };

  const setup = (props: ErrorSummaryProps) => {
    const wrapper = mount(
      <TestBed content={stubContent as any}>
        <ErrorSummary {...props} />
      </TestBed>,
    );

    const titleElement = findByQa(wrapper, "error-summary-title");
    const expiredMssgElement = findByQa(wrapper, "error-summary-expired-mssg");
    const unsavedMssgElement = findByQa(wrapper, "error-summary-unsaved-mssg");
    const generalMssgElement = findByQa(wrapper, "error-summary-general-mssg");

    return {
      wrapper,
      titleElement,
      expiredMssgElement,
      unsavedMssgElement,
      generalMssgElement,
    };
  };

  it("renders with title", () => {
    const { titleElement } = setup(unUnknownError);

    expect(titleElement.text()).toBe(stubContent.components.errorSummary.errorTitle.content);
  });

  describe("with correct content", () => {
    const availableErrorCodes = Object.keys(ErrorCode).filter((key) => typeof ErrorCode[key as any] === "number");
    const allAuthenticatedErrors = availableErrorCodes.filter(
      // TODO: We coerce the error code to a "keyof ErrorCode", then check against what we don't want. Code open to improvement
      (key) => (ErrorCode[key as any] as any) !== ErrorCode.UNAUTHENTICATED_ERROR,
    );

    it("with UNAUTHENTICATED_ERROR", () => {
      const { expiredMssgElement, unsavedMssgElement } = setup(unAuthenticatedError);

      expect(expiredMssgElement.text()).toBe(stubContent.components.errorSummary.expiredMessageContent.content);
      expect(unsavedMssgElement.text()).toBe(stubContent.components.errorSummary.unsavedWarningContent.content);
    });

    test.each(allAuthenticatedErrors)("with %s", () => {
      const { generalMssgElement } = setup(unUnknownError);

      expect(generalMssgElement.text()).toBe(stubContent.components.errorSummary.somethingGoneWrongContent.content);
    });
  });
});
