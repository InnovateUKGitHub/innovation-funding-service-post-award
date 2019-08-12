import React from "react";
import { Results } from "../validation/results";
import { NestedResult } from "../validation/nestedResult";
import { Result } from "../validation/result";

interface Props {
  validation?: Results<{}> | null;
  compressed?: boolean;
}

export const ValidationSummary: React.SFC<Props> = ({ validation, compressed }) => {
  const results: Result[] = [];
  if(validation && validation.showValidationErrors && validation.errors) {
      validation.errors.forEach(x => {
        // nested results have collection of items that may have errored
        // if we are not compressed we want to show each of them
        // need to find all invalid children and flatten them
        if(x instanceof NestedResult && compressed !== true && x.results.length) {
            const childErrors = x.results.map(y => y as Results<{}>).filter(y => !y.isValid).map(y => y.errors);
            const flattendErrors = childErrors.reduce((a, b) => a.concat(...b), []);
            flattendErrors.forEach(e => results.push(e));
        }
        else {
            results.push(x);
        }
      });
  }
  if (!results.length) {
    return null;
  }

  return (
    <div className="govuk-error-summary" aria-labelledby="error-summary-title" role="alert" tabIndex={-1} data-module="govuk-error-summary" data-qa="validation-summary">
      <h2 className="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>
      <div className="govuk-error-summary__body">
        <ul className="govuk-list govuk-error-summary__list">
          {results.map(x => <li key={`error${x.key}`}><a href={`#${x.key}`}>{x.errorMessage}</a></li>)}
        </ul>
      </div>
    </div>
  );
};
