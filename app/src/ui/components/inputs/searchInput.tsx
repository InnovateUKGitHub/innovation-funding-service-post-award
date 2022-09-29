import React, { useState } from "react";
import classNames from "classnames";
import { FormInputWidths, useDebounce } from "./input-utils";
import { InputProps } from "./common";

interface SearchInputProps extends InputProps<string> {
  maxLength?: number;
  width?: FormInputWidths;
  autoComplete?: React.InputHTMLAttributes<{}>["autoComplete"];
  qa?: string;
}

export const SearchInput = (props: SearchInputProps) => {
  const [state, setState] = useState({ value: props.value || "" });
  const debouncedOnChange = useDebounce(props.onChange, props.debounce);

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

  const classes = classNames("govuk-input", {
    "govuk-input--error": props.hasError === true,
    [`govuk-input--width-${props.width}`]: typeof props.width === "number",
    [`govuk-!-width-${props.width}`]: typeof props.width === "string",
  });
  return (
    <input
      id={props.name}
      data-qa={props.qa}
      type="search"
      className={classes}
      name={props.name}
      value={state.value}
      disabled={!!props.disabled}
      onChange={e => handleChange(e, true)}
      onBlur={e => handleChange(e, false)}
      onKeyUp={e => handleChange(e, false)}
      maxLength={props.maxLength}
      aria-label={props.ariaLabel}
      placeholder={props.placeholder}
      autoComplete={props.autoComplete}
    />
  );
};
