import React from "react";
import * as colour from "../../styles/colours"

export const TextHint: React.SFC<{ text: string|null}> = ({ text }) => {
  if(!text) {
    return null;
  }
  return (<div className="govuk-body" style={{color: colour.GOVUK_SECONDARY_TEXT_COLOUR}}>{text}</div>);
};
