import { useGovFrontend } from "@ui/hooks/gov-frontend.hook";
import cx from "classnames";
import { ButtonHTMLAttributes } from "react";

type ButtonName = string;

type ButtonSubTypes =
  | { secondary?: true; styling?: never; link?: never; warning?: never }
  | { warning?: true; styling?: never; link?: never; secondary?: never }
  | { link?: true; styling?: never; secondary?: never; warning?: never }
  | {
      styling?: "TableLink" | "Link" | "Secondary" | "Primary" | "Warning";
      link?: never;
      secondary?: never;
      warning?: never;
    };

const getButtonTypeClass = (type: ButtonProps["styling"] = "Primary") => {
  const govukButton = "govuk-button govuk-!-margin-right-1";

  const buttonTypeMap = {
    Primary: govukButton,
    Secondary: `${govukButton} govuk-button--secondary`,
    Warning: `${govukButton} govuk-button--warning`,
    Link: "govuk-link",
    TableLink: "govuk-link govuk-!-font-size-19",
  };

  return buttonTypeMap[type];
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { name?: ButtonName } & ButtonSubTypes;

export const Button = ({
  className,
  styling = "Primary",
  name = "button_default",
  secondary,
  link,
  warning,
  ...props
}: ButtonProps & {}) => {
  let styleTag = styling;
  if (secondary) {
    styleTag = "Secondary";
  } else if (link) {
    styleTag = "Link";
  } else if (warning) {
    styleTag = "Warning";
  }

  const { setRef } = useGovFrontend("Button");
  const buttonStyling = getButtonTypeClass(styleTag);
  return (
    <button ref={setRef} name={name} className={cx(buttonStyling, className)} data-module="govuk-button" {...props} />
  );
};

export const SubmitButton = (props: ButtonProps) => <Button type="submit" {...props} />;
