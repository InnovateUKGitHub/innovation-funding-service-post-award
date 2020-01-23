import React from "react";
import * as colour from "../../styles/colours";

export const TextHint: React.FunctionComponent<{ text: string|null}> = ({ text }) => {
  if(!text) {
    return null;
  }
  return (<div className="govuk-body" style={{color: colour.GOVUK_SECONDARY_TEXT_COLOUR}}>{text}</div>);
};
