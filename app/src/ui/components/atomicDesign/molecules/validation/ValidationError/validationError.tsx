import React from "react";
import { Result } from "@ui/validation/result";
import { Results } from "@ui/validation/results";
import { NestedResult } from "@ui/validation/nestedResult";

interface Props {
  error: Result | null | undefined;
  overrideMessage?: string;
}

const alignTextLeftStyle: React.CSSProperties = {
  textAlign: "left",
};

/**
 * Render a string, replacing all newline characters `\n` with HTML line breaks `<br />`
 * @returns React component with HTML line breaks injected
 */
const NewlineToBreak = ({ message }: { message: string | null }) => {
  if (message) {
    if (message.indexOf("\n") === 0) return <>{message}</>;

    return (
      <>
        {message.split("\n").reduce<React.ReactNode[]>((result, current, index) => {
          if (index > 0) {
            result.push(<br key={index} />);
          }
          result.push(current);
          return result;
        }, [])}
      </>
    );
  }

  return null;
};

const ValidationErrorMessage = ({ id, message }: { id: string; message: string | null }) => (
  <p id={id} style={alignTextLeftStyle} className="govuk-error-message">
    <NewlineToBreak message={message} />
  </p>
);

export const ValidationError = ({ error, overrideMessage }: Props) => {
  if (!error || error.isValid || !error.showValidationErrors) {
    return null;
  }

  // need to add anchor tags for all possible errors related to the display of this input error
  // if nested there are the results and summary errors to add as well
  const children = error instanceof NestedResult ? (error as NestedResult<Results<ResultBase>>).results : [];
  const associated = error instanceof NestedResult ? (error as NestedResult<Results<ResultBase>>).listValidation : null;
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
      {overrideMessage ? (
        <ValidationErrorMessage id={error.key} message={overrideMessage} />
      ) : (
        validations
          .filter(result => result.errorMessage)
          .map((result, index) => <ValidationErrorMessage key={index} id={result.key} message={result.errorMessage} />)
      )}
    </>
  );
};
