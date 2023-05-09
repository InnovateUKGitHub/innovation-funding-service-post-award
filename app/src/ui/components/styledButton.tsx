import React, { CSSProperties } from "react";
import classNames from "classnames";

import { useGovFrontend } from "@ui/hooks";

export interface StyledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  styling: "Link" | "Secondary" | "Primary" | "Warning";
  className?: string;
  style?: CSSProperties;
  qa?: string;
}

export const Button = ({ className, styling, qa, ...props }: StyledButtonProps) => {
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

  let dataQa: string | undefined = undefined;
  if (qa) {
    dataQa = qa;
  } else if (props.name) {
    dataQa = `${props.name}-qa`;
  }

  return (
    <button
      data-qa={dataQa}
      data-module="govuk-button"
      ref={setRef}
      className={classNames(buttonStyling, className)}
      {...props}
    />
  );
};
