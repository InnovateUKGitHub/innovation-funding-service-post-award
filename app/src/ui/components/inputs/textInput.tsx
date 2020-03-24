import * as React from "react";
import classNames from "classnames";
import { BaseInput, FormInputWidths } from "./baseInput";

interface TextInputProps extends InputProps<string> {
  maxLength?: number;
  handleKeyTyped?: boolean;
  width?: FormInputWidths;
}

export class TextInput extends BaseInput<TextInputProps, InputState> {
  constructor(props: TextInputProps) {
    super(props);
    this.state = { value: props.value || "" };
  }

  public componentWillReceiveProps(nextProps: InputProps<string>) {
    if (nextProps.value !== this.props.value) {

      this.setState({ value: nextProps.value || "" });
      this.cancelTimeout();
    }
  }

  public render() {
    return (
      <input
        id={this.props.name}
        type="text"
        className={classNames(
          "govuk-input", {
            "govuk-input--error": this.props.hasError === true,
            [`govuk-input--width-${this.props.width}`]: typeof this.props.width === "number",
            [`govuk-!-width-${this.props.width}`]: typeof this.props.width === "string",
          })}
        name={this.props.name}
        value={this.state.value}
        disabled={!!this.props.disabled}
        onChange={e => this.handleChange(e, true)}
        onBlur={e => this.handleChange(e, false)}
        onKeyUp={this.props.handleKeyTyped ? (e) => this.handleChange(e, false) : undefined}
        maxLength={this.props.maxLength}
        aria-label={this.props.ariaLabel}
        placeholder={this.props.placeholder}
      />
    );
  }

  private handleChange(e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>, debounce: boolean) {
    const value = e.currentTarget.value;
    if (this.state.value !== value) {
      this.setState({ value });
      this.debounce(() => this.changeNow(value), debounce);
    }
  }

  private changeNow(value: string) {
    this.cancelTimeout();
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }
}
