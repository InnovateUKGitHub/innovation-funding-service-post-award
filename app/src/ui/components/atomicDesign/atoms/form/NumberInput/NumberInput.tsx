import cx from "classnames";
import { forwardRef } from "react";
import type { DetailedHTMLProps, InputHTMLAttributes, Ref } from "react";
import type { FormInputWidths } from "@ui/components/bjss/inputs/input-utils";

export type NumberInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  "data-qa"?: string;
  hasError?: boolean;
  inputWidth?: FormInputWidths;
};

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, hasError, inputWidth, ...props }, ref: Ref<HTMLInputElement> | undefined) => (
    <input
      ref={ref}
      className={cx(
        "govuk-input",
        "govuk-table__cell--numeric",
        {
          "govuk-input--error": hasError === true,
          [`govuk-input--width-${inputWidth}`]: typeof inputWidth === "number",
          [`govuk-!-width-${inputWidth}`]: typeof inputWidth === "string",
        },
        className,
      )}
      type="text"
      inputMode="numeric"
      id={props.id || props.name}
      {...props}
    />
  ),
);

NumberInput.displayName = "NumberInput";

export { NumberInput };
