import { useGovFrontend } from "@ui/hooks/gov-frontend.hook";
import cx from "classnames";
import { ButtonHTMLAttributes } from "react";
import { useMounted } from "../../providers/Mounted/Mounted";

type ButtonName = `button_${string}`;

type ButtonSubTypes =
  | { secondary?: true; styling?: never; link?: never; warning?: never }
  | { warning?: true; styling?: never; link?: never; secondary?: never }
  | { link?: true; styling?: never; secondary?: never; warning?: never }
  | { styling?: "Link" | "Secondary" | "Primary" | "Warning"; link?: never; secondary?: never; warning?: never };

const getButtonTypeClass = (type: ButtonProps["styling"] = "Primary") => {
  const govukButton = "govuk-button govuk-!-margin-right-1";

  const buttonTypeMap = {
    Primary: govukButton,
    Secondary: `${govukButton} govuk-button--secondary`,
    Warning: `${govukButton} govuk-button--warning`,
    Link: "govuk-link",
  };

  return buttonTypeMap[type];
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { name?: ButtonName } & ButtonSubTypes;

/**
 * secondarySubmit allows the button to behave as submit type when javascript is disabled and as a button type
 * when javascript is enabled. Used to allow both validation with javascript enabled and also to use the submit
 * form handler with js disabled
 */
export const Button = ({
  secondarySubmit,
  className,
  styling = "Primary",
  name = "button_default",
  secondary,
  link,
  warning,
  ...props
}: ButtonProps & {
  secondarySubmit?: boolean;
}) => {
  let styleTag = styling;
  if (secondary) {
    styleTag = "Secondary";
  } else if (link) {
    styleTag = "Link";
  } else if (warning) {
    styleTag = "Warning";
  }

  const { isClient } = useMounted();
  const { setRef } = useGovFrontend("Button");
  const buttonStyling = getButtonTypeClass(styleTag);
  return (
    <button
      type={secondarySubmit && !isClient ? "submit" : "button"}
      ref={setRef}
      name={name}
      className={cx(buttonStyling, className)}
      data-module="govuk-button"
      {...props}
    />
  );
};

export const SubmitButton = (props: ButtonProps) => <Button type="submit" {...props} />;
