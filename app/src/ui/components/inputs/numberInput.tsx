import { useState } from "react";
import classNames from "classnames";
import { FormInputWidths, useDebounce } from "./input-utils";
import { InputProps, InputState } from "./common";

interface NumberInputProps extends InputProps<number> {
  id?: string;
  className?: string;
  width?: FormInputWidths;
}

interface NumberInputState extends InputState {
  invalid: boolean;
}

const getStateFromProps = (props: NumberInputProps): NumberInputState => {
  let value: string | null = null;
  if (props.value === null || props.value === undefined || isNaN(props.value)) {
    value = "";
  } else if (Number.isInteger(props.value)) {
    value = props.value.toString();
  } else if (Number(props.value)) {
    // handle floating point numbers
    value = Number(props.value.toFixed(6)).toString();
  } else {
    value = props.value.toString();
  }

  return {
    value,
    invalid: !!props.value && isNaN(props.value),
  };
};

export const NumberInput = (props: NumberInputProps) => {
  const [state, setState] = useState<NumberInputState>(getStateFromProps(props));

  const debouncedOnChange = useDebounce(props.onChange, props.debounce);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, debounce: boolean) => {
    const value = e.currentTarget.value;
    if (state.value !== value) {
      setState({ value, invalid: !/^-?\d*(\.\d{1,2})?$/.test(value) });
      const val = value === "" ? null : Number(value);
      if (debounce) {
        debouncedOnChange(val);
      } else if (props.onChange) {
        props.onChange(val);
      }
    }
  };

  const className = classNames(
    "govuk-input",
    "govuk-table__cell--numeric",
    {
      "govuk-input--error": state.invalid,
      [`govuk-input--width-${props.width}`]: typeof props.width === "number",
      [`govuk-!-width-${props.width}`]: typeof props.width === "string",
    },
    props.className,
  );

  return (
    <input
      id={props.id || props.name}
      type="text"
      inputMode="numeric"
      className={className}
      name={props.name}
      value={state.value}
      disabled={!!props.disabled}
      aria-label={props.ariaLabel}
      onChange={x => handleChange(x, true)}
      onBlur={x => handleChange(x, false)}
    />
  );
};
