import React from "react";

type TValidationError = { message?: string | null } | { [key: string]: TValidationError } | null | undefined;

interface Props {
  error: TValidationError;
}

const alignTextLeftStyle: React.CSSProperties = {
  textAlign: "left",
};

const mapErrors = (error: TValidationError, mappedErrors: string[] = []) => {
  if (error && "message" in error && typeof error.message === "string") {
    mappedErrors.push(error?.message ?? "");
    return mappedErrors;
  } else if (error && typeof error === "object") {
    Object.values(error).forEach(e => mapErrors(e, mappedErrors));
  }

  return mappedErrors;
};

export const ValidationError: React.FunctionComponent<Props> = ({ error }) => {
  if (!error) {
    return null;
  }

  const errorMap = mapErrors(error);

  return (
    <>
      {errorMap.map(message => (
        <p key={message} style={alignTextLeftStyle} className="govuk-error-message">
          {message}
        </p>
      ))}
    </>
  );
};
