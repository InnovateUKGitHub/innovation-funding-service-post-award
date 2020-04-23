import React from "react";
import { IValidationResult, Nested, NestedResult, Result, Results } from "../validation";
import { flatten } from "@framework/util/arrayHelpers";

interface Props {
  validation?: IValidationResult | null;
  compressed?: boolean;
}

const prepareMessage = (errorMessage: string | null | undefined): React.ReactNode => {
  if (errorMessage && errorMessage.indexOf("\n") === 0) {
    return errorMessage;
  }

  if (errorMessage) {
    return errorMessage.split("\n").reduce<React.ReactNode[]>((result, current, index) => {
      if (index > 0) {
        result.push(<br />);
      }
      result.push(current);
      return result;
    },
      []
    );
  }

  return null;
};

export const ValidationSummary: React.FunctionComponent<Props> = ({ validation, compressed }) => {
  const results: Result[] = [];
  if (validation && validation.errors) {
    validation.errors.filter(x => !x.isValid && x.showValidationErrors).forEach(x => {
      // nested results have collection of items that may have errored
      // if we are not compressed we want to show each of them
      // need to find all invalid children and flatten them
      if (x instanceof NestedResult && compressed !== true && x.results.length) {
        if (!x.listValidation.isValid) {
          results.push(x.listValidation);
        }
        else {
          const childErrors = flatten((x as NestedResult<Results<{}>>).results.filter(y => !y.isValid).map(y => y.errors));
          childErrors.forEach(e => results.push(e));
        }
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
          {results.map(x => <li key={`error${x.key}`}><a href={`#${x.key}`}>{prepareMessage(x.errorMessage)}</a></li>)}
        </ul>
      </div>
    </div>
  );
};
