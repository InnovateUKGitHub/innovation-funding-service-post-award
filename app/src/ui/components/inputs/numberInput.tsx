import { useState } from "react";
import classNames from "classnames";
import { FormInputWidths, useDebounce, useUpdateStateValueOnPropsChange } from "./input-utils";
import { InputProps, InputState } from "./common";

export interface NumberInputProps extends InputProps<number> {
  id?: string;
  className?: string;
  width?: FormInputWidths;

  /**
   * Enforce the input is valid, by disallowing users from entering invalid inputs.
   * This may be jarring to the end user who feel their keyboard is broken, as there is no response.
   */
  enforceValidInput?: boolean;
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
  const [oldStateInvalid, setInvalid] = useState<boolean>(false);
  const debouncedOnChange = useDebounce(props.onChange, props.debounce);

  useUpdateStateValueOnPropsChange<NumberInputState["value"], NumberInputState>(
    getStateFromProps(props).value,
    state.value,
    setState,
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, debounce: boolean) => {
    const value = e.currentTarget.value;
    const event = e.nativeEvent as InputEvent;

    if (state.value !== value) {
      const newInputValid = /^-?£?\d*\.?(\d{1,2})?$/.test(value);

      // If we are in an valid state, or if we are pasting, allow.
      // Otherwise, skip if we are enforcing valid inputs.
      if (newInputValid || oldStateInvalid || event.inputType === "insertFromPaste" || !props.enforceValidInput) {
        setState({ value, invalid: !newInputValid });
        setInvalid(!newInputValid);

        const val = value === "" ? null : Number(value.replaceAll("£", ""));
        if (debounce) {
          debouncedOnChange(val);
        } else if (props.onChange) {
          props.onChange(val);
        }
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
