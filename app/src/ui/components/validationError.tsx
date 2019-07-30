import React from "react";
import { Result } from "../validation/result";
import { NestedResult, Results } from "@ui/validation";

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

  // need to add anchor tags for all possible errors releated to the display of this input error
  // if nested there are the results and summary errors to add as well
  const children = error instanceof NestedResult ? (error as NestedResult<Results<{}>>).results : [];
  const associated = error instanceof NestedResult ? (error as NestedResult<Results<{}>>).summaryValidaion : null;
  const messageIds = children.filter(x => !x.isValid && x.showValidationErrors).map(x => x.errors).reduce((a, b) => a.concat(b), []).map(x => x.key);

  if(associated && !associated.isValid && associated.showValidationErrors) {
    messageIds.push(associated.key);
  }
  messageIds.push(error.key);

  return (
    <React.Fragment>
      {messageIds.map(key => <a id={key} key={key} aria-hidden="true"/>)}
      <span style={alignTextLeftStyle} className="govuk-error-message">{error.errorMessage}</span>
    </React.Fragment>
  );
};
