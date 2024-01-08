import cx from "classnames";
import React from "react";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { FormGroup } from "../form/FormGroup/FormGroup";

export const DateInputGroup = ({
  children,
  hasError,
  error,
  ...props
}: React.ComponentProps<"div"> & { error?: RhfError; hasError?: boolean }) => {
  return (
    <FormGroup className={cx({ "govuk-form-group--error": !!error || hasError })} {...props}>
      <ValidationError error={error} />
      <div className="govuk-date-input">
        {React.Children.map(children, child => {
          if (!child || typeof child === "string" || typeof child == "number" || typeof child == "boolean") {
            throw new Error(" children of date input group must be a DateInput component");
          }
          if ("props" in child) {
            return React.cloneElement(child, { hasError: !!error || hasError || child?.props?.hasError });
          } else {
            return child;
          }
        })}
      </div>
    </FormGroup>
  );
};
