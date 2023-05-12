import { DetailedHTMLProps, FormHTMLAttributes } from "react";
import { SecurityTokenInput } from "../components/SecurityTokenInput";

type FormProps = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & { "data-qa"?: string };

const Form = ({
  action = "",
  encType = "application/x-www-form-urlencoded",
  method = "post",
  children,
  ...props
}: FormProps) => {
  return (
    <form encType={encType} method={method} action={action} {...props}>
      <SecurityTokenInput />

      {children}
    </form>
  );
};

export { Form };
