import React from "react";
import { Results } from "../validation/results";
import { NestedResult } from "../validation/nestedResult";
import { Result } from "../validation/result";

interface Props {
  validation: Results<{}>;
  compressed?: boolean;
}

export const ValidationSummary: React.SFC<Props> = ({ validation, compressed }) => {
  const results: Result[] = [];
  if(validation && validation.showValidationErrors && validation.errors) {
      validation.errors.forEach(x => {
        if(x instanceof NestedResult && compressed !== true && x.results.length) {
            x.results.map(y => y as Results<{}>).map(y => y.errors).reduce((a, b) => a.concat(...b), []).forEach(e => results.push(e));
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
    <div className="govuk-error-summary" ria-labelledby="error-summary-title" role="alert" tabIndex={-1} data-module="error-summary">
      <h2 className="govuk-error-summary__title" id="error-summary-title">There is a problem</h2>
      <div className="govuk-error-summary__body">
        <ul className="govuk-list govuk-error-summary__list">
          {results.map(x => <li key={`error${x.key}`}><a href={`#${x.key}`}>{x.errorMessage}</a></li>)}
        </ul>
      </div>
    </div>
  );
};
