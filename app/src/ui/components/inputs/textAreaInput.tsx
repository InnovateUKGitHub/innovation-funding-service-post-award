import React, { useState } from "react";
import cx from "classnames";
import { useDebounce, useResetValueOnNameChange } from "./input-utils";
import { InputProps } from "./common";
import { CharacterCount, CharacterTypes } from "./CharacterCount";

export interface TextAreaInputProps extends InputProps<string> {
  maxLength?: number;
  rows?: number;
  qa?: string;
  characterCountOptions?: CharacterTypes | "off";
}

export const TextAreaInput = (props: TextAreaInputProps) => {
  // Controlled state value.
  const [state, setState] = useState<{ value: string }>({ value: props.value ?? "" });

  useResetValueOnNameChange(setState, props.name);

  const debouncedOnChange = useDebounce(props.onChange, props.debounce);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>, debounce: boolean) => {
    const value = e.currentTarget.value;

    setState({ value });

    if (debounce) {
      debouncedOnChange(value);
    } else if (props.onChange) {
      props.onChange(value);
    }
  };

  const TextAreaComponent = (
    <textarea
      id={props.name}
      name={props.name}
      className={cx("govuk-textarea", { "govuk-input--error": props.hasError })}
      rows={props.rows}
      value={state.value}
      disabled={!!props.disabled}
      onChange={x => handleChange(x, true)}
      onBlur={x => handleChange(x, false)}
      maxLength={props.maxLength}
      aria-describedby={props.ariaDescribedBy}
      data-qa={props.qa}
      aria-label={props.ariaLabel}
    />
  );

  return props.characterCountOptions === "off" ? (
    // Note: We treat optional param as a default config below
    TextAreaComponent
  ) : (
    <CharacterCount type="ascending" count={state.value.length} {...props.characterCountOptions}>
      {TextAreaComponent}
    </CharacterCount>
  );
};
