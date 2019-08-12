import React from "react";
import { IAppError } from "@framework/types/IAppError";

interface Props {
  error?: IAppError | null;
}

export const ErrorSummary: React.SFC<Props> = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabIndex={-1} data-module="govuk-error-summary" data-qa="error-summary">
      <h2 className="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>
      <div className="govuk-error-summary__body">
        Something has gone wrong at our end and we were unable to complete the action. Try submitting the page again.
      </div>
    </div>
  );
};
