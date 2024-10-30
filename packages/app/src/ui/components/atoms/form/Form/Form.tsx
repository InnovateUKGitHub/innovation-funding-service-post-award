import { SecurityTokenInput } from "@ui/components/atoms/form/SecurityTokenInput/SecurityTokenInput";
import { DetailedHTMLProps, FormHTMLAttributes } from "react";

type FormProps = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> & {
  "data-qa"?: string;
  encType?: "application/x-www-form-urlencoded" | "multipart/form-data";
};

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
