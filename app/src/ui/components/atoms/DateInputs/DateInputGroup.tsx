import cx from "classnames";
import React, { ReactNode } from "react";
import { ValidationError } from "@ui/components/atoms/validation/ValidationError/ValidationError";
import { FormGroup } from "../form/FormGroup/FormGroup";

export const DateInputGroup = ({
  children,
  hasError,
  error,
  hint,
  noMarginBottom,
  ...props
}: React.ComponentProps<"div"> & {
  error?: RhfError;
  hasError?: boolean;
  hint?: ReactNode;
  noMarginBottom?: boolean;
}) => {
  return (
    <FormGroup noMarginBottom={noMarginBottom} className={cx({ "govuk-form-group--error": !!error })} {...props}>
      {typeof hint !== "undefined" && hint}
      <ValidationError error={error} />
      <div className="govuk-date-input">
        {React.Children.map(children, child => {
          if (!child || typeof child === "string" || typeof child == "number" || typeof child == "boolean") {
            throw new Error(" children of date input group must be a DateInput component");
          }
          if ("props" in child) {
            return React.cloneElement(child, {
              hasError: !!error || hasError || child?.props?.hasError,
              noMarginBottom,
            });
          } else {
            return child;
          }
        })}
      </div>
    </FormGroup>
  );
};
