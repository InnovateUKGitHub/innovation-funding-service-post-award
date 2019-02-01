import React from "react";
import { Result } from "../validation/result";

interface Props {
  error: Result | null | undefined;
  key?: string;
}

const alignTextLeftStyle: React.CSSProperties = {
  textAlign: "left",
};

export const ValidationError: React.SFC<Props> = ({ error }) => {
  if (!error || error.isValid || !error.showValidationErrors) {
    return null;
  }

  return (<a id={error.key} style={alignTextLeftStyle} className="govuk-error-message">{error.errorMessage}</a>);
};
