import { mapErrors, TValidationError } from "@framework/mappers/mapRhfError";
import { useContent } from "@ui/hooks/content.hook";
import React from "react";
import { AccessibilityText } from "../../AccessibilityText/AccessibilityText";

interface Props {
  error: TValidationError;
  id?: string;
  "data-qa"?: string;
}

const alignTextLeftStyle: React.CSSProperties = {
  textAlign: "left",
};

export const ValidationError = ({ error, id, "data-qa": qa }: Props) => {
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
          data-qa={qa ? `${qa}-${index}` : undefined}
          key={message}
          style={alignTextLeftStyle}
          className="govuk-error-message"
        >
          <AccessibilityText as="span">{getContent(x => x.components.validationError.prefix)}</AccessibilityText>{" "}
          {message}
        </p>
      ))}
    </>
  );
};
