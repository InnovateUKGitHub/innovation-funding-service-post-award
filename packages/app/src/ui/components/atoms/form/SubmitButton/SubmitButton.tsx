import { useGovFrontend } from "@ui/hooks/gov-frontend.hook";
import cx from "classnames";
import { DetailedHTMLProps, ButtonHTMLAttributes } from "react";

type Props = DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  "data-qa"?: string;
  // name field is required in order to be compatible with form handlers when JS disabled
  name?: `button_${"default" | "upload"}`;
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
