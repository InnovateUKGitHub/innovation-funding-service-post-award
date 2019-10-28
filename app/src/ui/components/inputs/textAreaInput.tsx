import * as React from "react";
import classNames from "classnames";
import { BaseInput } from "./baseInput";

interface TextAreaInputProps extends InputProps<string> {
  maxLength?: number;
  rows?: number;
  qa?: string;
}

export class TextAreaInput extends BaseInput<TextAreaInputProps, InputState> {
  constructor(props: TextAreaInputProps) {
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
      <textarea
        id={this.props.name}
        name={this.props.name}
        className={classNames("govuk-textarea", { "govuk-input--error": this.props.hasError === true })}
        rows={this.props.rows || 5}
        value={this.state.value}
        disabled={!!this.props.disabled}
        onChange={x => this.handleChange(x, true)}
        onBlur={x => this.handleChange(x, false)}
        maxLength={this.props.maxLength}
        aria-describedby={this.props.ariaDescribedBy}
        data-qa={this.props.qa}
        aria-label={this.props.ariaLabel}
      />
    );
  }

  private handleChange(e: React.ChangeEvent<HTMLTextAreaElement>, allowDebounce: boolean) {
    const value = e.currentTarget.value;
    if (this.state.value !== value) {
      this.setState({ value });
      this.debounce(() => this.changeNow(value), allowDebounce);
    }
  }

  private changeNow(value: string) {
    this.cancelTimeout();

    if (this.props.onChange) {
      this.props.onChange(value);
    }
  }
}
