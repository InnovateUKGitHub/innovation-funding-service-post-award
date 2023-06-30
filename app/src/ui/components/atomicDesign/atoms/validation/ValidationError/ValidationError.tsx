import { mapErrors, TValidationError } from "@framework/mappers/mapRhfError";
import { useContent } from "@ui/hooks/content.hook";
import React from "react";
import { AccessibilityText } from "../../AccessibilityText/AccessibilityText";

interface Props {
  error: TValidationError;
  id?: string;
}

const alignTextLeftStyle: React.CSSProperties = {
  textAlign: "left",
};

const mapErrors = (error: TValidationError, mappedErrors: string[] = []) => {
  if (error) {
    if ("message" in error && typeof error.message === "string") {
      mappedErrors.push(error?.message ?? "");
      return mappedErrors;
    } else {
      Object.values(error).forEach(e => mapErrors(e, mappedErrors));
    }
  }

  return mappedErrors;
};
export const ValidationError = ({ error, id }: Props) => {
  const { getContent } = useContent();

  if (!error) {
    return null;
  }

  const errorMap = mapErrors(error);

  return (
    <>
      {errorMap.map((message, index) => (
        <p
          id={id ? `${id}-${index}` : undefined}
          key={message}
          style={alignTextLeftStyle}
          className="govuk-error-message"
        >
          <AccessibilityText>{getContent(x => x.components.validationError.prefix)}</AccessibilityText> {message}
        </p>
      ))}
    </>
  );
};
