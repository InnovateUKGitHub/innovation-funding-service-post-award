/* eslint-disable jsx-a11y/anchor-has-content */
// TODO: This should be a button since we supply no href
/* eslint-disable jsx-a11y/anchor-is-valid */

import React from "react";
import { v4 as uuid } from "uuid";
import { NestedResult, Results } from "@ui/validation";
import { Result } from "../validation/result";


interface Props {
  error: Result | null | undefined;
  hideMessage?: boolean;
  overrideMessage?: string;
}

const alignTextLeftStyle: React.CSSProperties = {
  textAlign: "left",
};

const prepareMessage = (
  overrideMessage: string | null | undefined,
  errorMessage: string | null | undefined,
): React.ReactNode => {
  if (overrideMessage) {
    return overrideMessage;
  }

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
    }, []);
  }

  return null;
};

export const ValidationError: React.FunctionComponent<Props> = ({ error, hideMessage = false, overrideMessage }) => {
  if (!error || error.isValid || !error.showValidationErrors) {
    return null;
  }

  // need to add anchor tags for all possible errors related to the display of this input error
  // if nested there are the results and summary errors to add as well
  const children = error instanceof NestedResult ? (error as NestedResult<Results<{}>>).results : [];
  const associated = error instanceof NestedResult ? (error as NestedResult<Results<{}>>).listValidation : null;
  const validations = children
    .filter(x => !x.isValid && x.showValidationErrors)
    .map(x => x.errors)
    .reduce((a, b) => a.concat(b), []);

  if (associated && !associated.isValid && associated.showValidationErrors) {
    validations.push(associated);
  }

  validations.push(error);

  return (
    <>
      {validations.map(r => (
        <ValidationErrorAnchor key={uuid()} result={r} />
      ))}

      {!hideMessage && (
        <p style={alignTextLeftStyle} className="govuk-error-message">
          {prepareMessage(overrideMessage, error.errorMessage)}
        </p>
      )}
    </>
  );
};

const ValidationErrorAnchor: React.FunctionComponent<{ result: Result }> = ({ result }) => {
  // TODO: this shouldn't be an anchor without an href, a styled button will do
  return <a id={result.key} aria-hidden="true" />;
};
