import React from "react";
import classNames from "classnames";
import { BaseInput, FormInputWidths } from "./baseInput";
import { InputProps, InputState } from "./common";

interface SearchInputProps extends InputProps<string> {
  maxLength?: number;
  width?: FormInputWidths;
  autoComplete?: React.InputHTMLAttributes<{}>["autoComplete"];
  qa?: string;
}

export class SearchInput extends BaseInput<SearchInputProps, InputState> {
  constructor(props: SearchInputProps) {
    super(props);
    this.state = { value: props.value || "" };
  }

  public componentWillReceiveProps(nextProps: InputProps<string>) {
    if (nextProps.value !== this.props.value) {
      this.setState({ value: nextProps.value || "" }, this.cancelTimeout);
    }
  }

  public render() {
    const classes = classNames("govuk-input", {
      "govuk-input--error": this.props.hasError === true,
      [`govuk-input--width-${this.props.width}`]: typeof this.props.width === "number",
      [`govuk-!-width-${this.props.width}`]: typeof this.props.width === "string",
    });
    return (
      <input
        id={this.props.name}
        data-qa={this.props.qa}
        type="search"
        className={classes}
        name={this.props.name}
        value={this.state.value}
        disabled={!!this.props.disabled}
        onChange={e => this.handleChange(e, true)}
        onBlur={e => this.handleChange(e, false)}
        onKeyUp={e => this.handleChange(e, false)}
        maxLength={this.props.maxLength}
        aria-label={this.props.ariaLabel}
        placeholder={this.props.placeholder}
        autoComplete={this.props.autoComplete}
      />
    );
  }

  private handleChange(
    e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>,
    debounce: boolean,
  ) {
    const value = e.currentTarget.value;

    if (this.state.value !== value) {
      this.setState({ value }, () => {
        this.debounce(() => this.changeNow(value), debounce);
      });
    }
  }

  private changeNow(value: string) {
    this.cancelTimeout();

    this.props.onChange?.(value);
  }
}
