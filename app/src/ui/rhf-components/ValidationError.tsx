import React from "react";
import { FieldError } from "react-hook-form";

interface Props {
  error: FieldError | null | undefined;
}

const alignTextLeftStyle: React.CSSProperties = {
  textAlign: "left",
};

const mapErrors = (error: FieldError, mappedErrors: string[] = []) => {
  if ("message" in error && typeof error.message === "string") {
    mappedErrors.push(error?.message ?? "");
    return mappedErrors;
  } else if (typeof error === "object") {
    Object.values(error).forEach(e => mapErrors(e as FieldError, mappedErrors));
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
