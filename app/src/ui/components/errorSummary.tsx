import React from "react";

interface Props {
  error?: IAppError | null;
}

export const ErrorSummary: React.SFC<Props> = ({ error }) => {
  if (!error) {
    return null;
  }

  return (
    <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabIndex={-1} data-module="error-summary" data-qa="error-summary">
      <h2 className="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>
      <div className="govuk-error-summary__body">
        Something happened and we couldn't process your request. Please try again later.
      </div>
    </div>
  );
};
