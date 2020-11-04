import React from "react";
import { ErrorCode, IAppError } from "@framework/types/IAppError";
import { useContent } from "@ui/redux";

interface ErrorSummaryProps {
  error?: IAppError | null;
}

export const ErrorSummary = ({ error }: ErrorSummaryProps) => {
  const {getContent} = useContent();
  if (!error) return null;

  const isUnauthenticated = error.code === ErrorCode.UNAUTHENTICATED_ERROR;

  const title = getContent(x => x.components.errorSummary.errorTitle);
  const expiredMessage = getContent(x => x.components.errorSummary.expiredMessageContent);
  const unsavedWarning = getContent(x => x.components.errorSummary.unsavedWarningContent);
  const somethingGoneWrong = getContent(x => x.components.errorSummary.somethingGoneWrongContent);

  return (
    <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabIndex={-1} data-module="govuk-error-summary" data-qa="error-summary">
      <h2 className="govuk-error-summary__title" id="error-summary-title">{title}</h2>
      <div className="govuk-error-summary__body">
        {isUnauthenticated ? (
          <>
          <p>{expiredMessage}</p>
          <p>{unsavedWarning}</p>
          </>
        ) : (
          <p>{somethingGoneWrong}</p>
        )}
      </div>
    </div>
  );
};
