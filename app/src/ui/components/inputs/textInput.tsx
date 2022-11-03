import React, { useState } from "react";
import classNames from "classnames";
import { FormInputWidths, useDebounce, useUpdateStateValueOnPropsChange } from "./input-utils";
import { InputProps } from "./common";

export interface TextInputProps extends InputProps<string> {
  maxLength?: number;
  handleKeyTyped?: boolean;
  width?: FormInputWidths;
  className?: string;
  id?: string;
}

export const TextInput = (props: TextInputProps) => {
  const [state, setState] = useState({ value: props.value ?? "" });
  const debouncedOnChange = useDebounce(props.onChange, props.debounce);

  useUpdateStateValueOnPropsChange(props.value ?? "", setState);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>,
    debounce: boolean,
  ) => {
    const value = e.currentTarget.value;
    setState({ value });
    if (debounce) {
      debouncedOnChange(value);
    } else if (props.onChange) {
      props.onChange(value);
    }
  };

  return (
    <input
      id={props.id || props.name}
      type="text"
      className={classNames(props.className, "govuk-input", {
        "govuk-input--error": props.hasError === true,
        [`govuk-input--width-${props.width}`]: typeof props.width === "number",
        [`govuk-!-width-${props.width}`]: typeof props.width === "string",
      })}
      name={props.name}
      value={state.value}
      disabled={!!props.disabled}
      onChange={e => handleChange(e, true)}
      onBlur={e => handleChange(e, false)}
      onKeyUp={props.handleKeyTyped ? e => handleChange(e, false) : undefined}
      maxLength={props.maxLength}
      aria-label={props.ariaLabel}
      placeholder={props.placeholder}
    />
  );
};
