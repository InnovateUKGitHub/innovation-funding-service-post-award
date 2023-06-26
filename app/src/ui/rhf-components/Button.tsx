import { useGovFrontend } from "@ui/hooks/gov-frontend.hook";
import cx from "classnames";
import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";

type ButtonName = `button_${"default" | "upload" | "save" | "reviewDocuments"}`;

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  "data-qa"?: string;
  // name field is required in order to be compatible with form handlers when JS disabled
  name?: ButtonName;
};
export const SubmitButton = ({ className, name = "button_default", ...props }: Props) => {
  const { setRef } = useGovFrontend("Button");
  return (
    <button
      ref={setRef}
      type="submit"
      name={name}
      className={cx("govuk-button govuk-!-margin-right-1", className)}
      data-module="govuk-button"
      {...props}
    />
  );
};

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

type ButtonSubTypes =
  | { secondary?: true; styling?: never; link?: never; warning?: never }
  | { warning?: true; styling?: never; link?: never; secondary?: never }
  | { link?: true; styling?: never; secondary?: never; warning?: never }
  | { styling?: "Link" | "Secondary" | "Primary" | "Warning"; link?: never; secondary?: never; warning?: never };

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { name: ButtonName } & ButtonSubTypes;
export const Button = ({
  className,
  styling = "Primary",
  name = "button_default",
  secondary,
  link,
  warning,
  ...props
}: ButtonProps) => {
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
