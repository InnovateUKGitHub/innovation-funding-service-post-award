import React, { CSSProperties } from "react";
import classNames from "classnames";

import { useGovFrontend } from "@ui/hooks";

export interface StyledButtonProps extends React.ButtonHTMLAttributes<{}> {
  styling: "Link" | "Secondary" | "Primary" | "Warning";
  className?: string;
  style?: CSSProperties;
}

export function Button({ className, styling, ...props }: StyledButtonProps) {
  const { setRef } = useGovFrontend("Button");

  const getButtonTypeClass = (type: StyledButtonProps["styling"]) => {
    const govukButton = "govuk-button govuk-!-margin-right-1";

    const buttonTypeMap = {
      Primary: govukButton,
      Secondary: `${govukButton} govuk-button--secondary`,
      Warning: `${govukButton} govuk-button--warning`,
      Link: "govuk-link",
    };

    return buttonTypeMap[type] || govukButton;
  };

  const buttonStyling = getButtonTypeClass(styling);

  return <button data-module="govuk-button" ref={setRef} className={classNames(buttonStyling, className)} {...props} />;
}
