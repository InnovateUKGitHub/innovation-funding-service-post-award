import { mapErrors, TValidationError } from "@framework/mappers/mapRhfError";
import { useContent } from "@ui/hooks/content.hook";
import React from "react";
import { AccessibilityText } from "../../AccessibilityText/AccessibilityText";
import classNames from "classnames";

interface Props {
  error: TValidationError;
  id?: string;
  "data-qa"?: string;
  className?: string;
}

const alignTextLeftStyle: React.CSSProperties = {
  textAlign: "left",
};

export const ValidationError = ({ error, id, "data-qa": qa, className }: Props) => {
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
          className={classNames("govuk-error-message", className)}
        >
          <AccessibilityText as="span">{getContent(x => x.components.validationError.prefix)}</AccessibilityText>{" "}
          {message}
        </p>
      ))}
    </>
  );
};
