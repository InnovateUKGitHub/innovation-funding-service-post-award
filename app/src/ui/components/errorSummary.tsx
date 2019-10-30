import React from "react";
import { ErrorCode, IAppError } from "@framework/types/IAppError";

interface Props {
  error?: IAppError | null;
}

const getMessageContent = (error: IAppError) => {
  if (error.code === ErrorCode.UNAUTHENTICATED_ERROR) {
    return (
      <React.Fragment>
        <p>Your session has expired. You must reload the page before trying again.</p>
        <p>Anything you have not already saved will be lost.</p>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <p>Something has gone wrong at our end and we were unable to complete the action. Try submitting the page again.</p>
    </React.Fragment>
  );
};

export const ErrorSummary: React.SFC<Props> = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabIndex={-1} data-module="govuk-error-summary" data-qa="error-summary">
      <h2 className="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>
      <div className="govuk-error-summary__body">
        {getMessageContent(error)}
      </div>
    </div>
  );
};
