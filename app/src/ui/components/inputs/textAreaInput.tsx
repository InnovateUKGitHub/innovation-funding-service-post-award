import React from "react";
import cx from "classnames";

import { BaseInput } from "./baseInput";
import { InputProps, InputState } from "./common";
import { CharacterCount, CharacterTypes } from "./CharacterCount";

export interface TextAreaInputProps extends InputProps<string> {
  maxLength?: number;
  rows?: number;
  qa?: string;
  characterCountOptions?: CharacterTypes | "off";
}

export class TextAreaInput extends BaseInput<TextAreaInputProps, InputState> {
  constructor(props: TextAreaInputProps) {
    super(props);
    this.state = { value: props.value ?? "" };
  }

  public componentWillReceiveProps(nextProps: InputProps<string>) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value ?? "" }, () => {
        this.cancelTimeout();
      });
    }
  }

  public render() {
    const { value } = this.state;

    const {
      qa,
      characterCountOptions,
      name,
      rows = 5,
      hasError,
      ariaDescribedBy,
      maxLength,
      ariaLabel,
      ...props
    } = this.props;

    const textareaElement = (
      <textarea
        id={name}
        name={name}
        className={cx("govuk-textarea", { "govuk-input--error": hasError })}
        rows={rows}
        value={value}
        disabled={!!props.disabled}
        onChange={x => this.handleChange(x, true)}
        onBlur={x => this.handleChange(x, false)}
        maxLength={maxLength}
        aria-describedby={ariaDescribedBy}
        data-qa={qa}
        aria-label={ariaLabel}
      />
    );

    return characterCountOptions === "off" ? (
      // Note: We treat optional param as a default config below
      textareaElement
    ) : (
      <CharacterCount type="ascending" count={value.length} {...characterCountOptions}>
        {textareaElement}
      </CharacterCount>
    );
  }

  private handleChange(e: React.ChangeEvent<HTMLTextAreaElement>, allowDebounce: boolean) {
    const inputValue = e.currentTarget.value;

    if (this.state.value !== inputValue) {
      this.setState({ value: inputValue }, () => {
        this.debounce(() => this.changeNow(inputValue), allowDebounce);
      });
    }
  }

  private changeNow(value: string) {
    this.cancelTimeout();

    this.props.onChange?.(value);
  }
}
