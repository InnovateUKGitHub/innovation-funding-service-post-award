import cx from "classnames";
import { forwardRef } from "react";
import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { FormInputWidths } from "../../../../bjss/inputs/input-utils";

export type TextInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  "data-qa"?: string;
  hasError?: boolean;
  inputWidth?: FormInputWidths;
  prefix?: string;
  suffix?: string;
  numeric?: boolean;
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, hasError, inputWidth, prefix, suffix, numeric, ...props }, ref) => (
    <div className="govuk-input__wrapper">
      {prefix && <div className="govuk-input__prefix">{prefix}</div>}
      <input
        ref={ref}
        className={cx(
          "govuk-input",
          {
            "govuk-input--error": hasError === true,
            [`govuk-input--width-${inputWidth}`]: typeof inputWidth === "number",
            [`govuk-!-width-${inputWidth}`]: typeof inputWidth === "string",
            "govuk-table__cell--numeric": numeric,
          },
          className,
        )}
        type="text"
        id={!!props.id ? props.id : props.name}
        {...props}
      />
      {suffix && <div className="govuk-input__suffix">{suffix}</div>}
    </div>
  ),
);

TextInput.displayName = "TextInput";
export { TextInput };
