import cx from "classnames";
import React from "react";
import { ValidationError } from "@ui/components/atomicDesign/atoms/validation/ValidationError/ValidationError";
import { FormGroup } from "../form/FormGroup/FormGroup";

export const DateInputGroup = ({ children, error, ...props }: React.ComponentProps<"div"> & { error?: RhfError }) => {
  return (
    <FormGroup className={cx({ "govuk-form-group--error": !!error })} {...props}>
      <ValidationError error={error} />
      <div className="govuk-date-input">
        {React.Children.map(children, child =>
          typeof child === "string" ? child : React.cloneElement(child as React.ReactElement, { hasError: !!error }),
        )}
      </div>
    </FormGroup>
  );
};
