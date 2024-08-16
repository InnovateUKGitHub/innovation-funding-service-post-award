import cx from "classnames";
import { forwardRef } from "react";
import type { DetailedHTMLProps, InputHTMLAttributes, Ref } from "react";
import type { FormInputWidths } from "@ui/components/input-utils";

export type NumberInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  "data-qa"?: string;
  hasError?: boolean;
  inputWidth?: FormInputWidths;
  prefix?: string;
  suffix?: string;
};

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, hasError, inputWidth, prefix, suffix, ...props }, ref: Ref<HTMLInputElement> | undefined) => (
    <div className="govuk-input__wrapper">
      {prefix && <div className="govuk-input__prefix">{prefix}</div>}
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
      {suffix && <div className="govuk-input__suffix">{suffix}</div>}
    </div>
  ),
);

NumberInput.displayName = "NumberInput";

export { NumberInput };
