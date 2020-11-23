import React from "react";
import { ErrorCode } from "@framework/types/IAppError";
import { useContent } from "@ui/hooks";

export interface ErrorSummaryProps {
  code: ErrorCode;
}

export function ErrorSummary({ code }: ErrorSummaryProps) {
  const { getContent } = useContent();
  const isUnauthenticated = code === ErrorCode.UNAUTHENTICATED_ERROR;

  const title = getContent(x => x.components.errorSummary.errorTitle);
  const expiredMessage = getContent(x => x.components.errorSummary.expiredMessageContent);
  const unsavedWarning = getContent(x => x.components.errorSummary.unsavedWarningContent);
  const somethingGoneWrong = getContent(x => x.components.errorSummary.somethingGoneWrongContent);

  return (
    <div
      className="govuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex={-1}
      data-module="govuk-error-summary"
      data-qa="error-summary"
    >
      <h2 className="govuk-error-summary__title" id="error-summary-title" data-qa="error-summary-title">
        {title}
      </h2>

      <div className="govuk-error-summary__body">
        {isUnauthenticated ? (
          <>
            <p data-qa="error-summary-expired-mssg">{expiredMessage}</p>
            <p data-qa="error-summary-unsaved-mssg">{unsavedWarning}</p>
          </>
        ) : (
          <p data-qa="error-summary-general-mssg">{somethingGoneWrong}</p>
        )}
      </div>
    </div>
  );
}
