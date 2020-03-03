import React from "react";
import { Result } from "../validation/result";
import { NestedResult, Results } from "@ui/validation";

interface Props {
  error: Result | null | undefined;
  hideMessage?: boolean;
  overrideMessage?: string;
}

const alignTextLeftStyle: React.CSSProperties = {
  textAlign: "left",
};

export const ValidationError: React.FunctionComponent<Props> = ({ error, hideMessage = false, overrideMessage }) => {
  if (!error || error.isValid || !error.showValidationErrors) {
    return null;
  }

  // need to add anchor tags for all possible errors related to the display of this input error
  // if nested there are the results and summary errors to add as well
  const children = error instanceof NestedResult ? (error as NestedResult<Results<{}>>).results : [];
  const associated = error instanceof NestedResult ? (error as NestedResult<Results<{}>>).listValidation : null;
  const validations = children.filter(x => !x.isValid && x.showValidationErrors).map(x => x.errors).reduce((a, b) => a.concat(b), []);

  if (associated && !associated.isValid && associated.showValidationErrors) {
    validations.push(associated);
  }
  validations.push(error);

  return (
    <React.Fragment>
      {validations.map((r) => <ValidationErrorAnchor result={r} key={r.key} />)}
      {!hideMessage ? <span style={alignTextLeftStyle} className="govuk-error-message">{overrideMessage || error.errorMessage}</span> : null}
    </React.Fragment>
  );
};

const ValidationErrorAnchor: React.FunctionComponent<{ result: Result }> = ({ result }) => {
  return <a id={result.key} key={result.key} aria-hidden="true" />;
};
