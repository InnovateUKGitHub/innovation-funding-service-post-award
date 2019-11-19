import React from "react";
import classNames from "classnames";
import { BaseInput, FormInputWidths } from "./baseInput";

interface NumberInputProps extends InputProps<number> {
  id?: string;
  className?: string;
  width?: FormInputWidths;
}

interface NumberInputState extends InputState {
  invalid: boolean;
}

export class NumberInput extends BaseInput<NumberInputProps, NumberInputState> {

  constructor(props: NumberInputProps) {
    super(props);
    this.state = this.getStateFromProps(props);
  }

  public componentWillReceiveProps(nextProps: NumberInputProps) {
    // if both new and current is nan then don't change
    if (nextProps.value !== this.props.value && !(isNaN(nextProps.value!) && !isFinite(this.state.value as any))) {
      this.setState(this.getStateFromProps(nextProps));
      this.cancelTimeout();
    }
  }

  public render() {
    const className = classNames(
      "govuk-input",
      "govuk-table__cell--numeric",
      {
        "govuk-input--error": this.state.invalid,
        [`govuk-input--width-${this.props.width}`]: typeof this.props.width === "number",
        [`govuk-!-width-${this.props.width}`]: typeof this.props.width === "string",
      },
      this.props.className
    );

    return (
      <input
        id={this.props.id || this.props.name}
        type="text"
        className={className}
        name={this.props.name}
        value={this.state.value}
        disabled={!!this.props.disabled}
        aria-label={this.props.ariaLabel}
        onChange={x => this.handleChange(x, true)}
        onBlur={x => this.handleChange(x, false)}
      />
    );
  }

  private getStateFromProps(props: NumberInputProps): NumberInputState {
    let value: string | null = null;
    if (props.value === null || props.value === undefined) {
      value = "";
    }
    else if (Number.isInteger(props.value)) {
      value = props.value.toString();
    }
    else if (Number(props.value)) {
      // handle floating point numbers
      value = Number(props.value.toFixed(6)).toString();
    }
    else {
      value = props.value.toString();
    }

    return {
      value,
      invalid: !!props.value && isNaN(props.value)
    };
  }

  private handleChange(e: React.ChangeEvent<HTMLInputElement>, allowDebounce: boolean) {
    const value = e.currentTarget.value;
    if (this.state.value !== value) {
      this.setState({ value });
      this.debounce(() => this.changeNow(value), allowDebounce);
    }
  }

  private changeNow(value: string) {
    this.cancelTimeout();

    const newValue = value === "" ? null : (isFinite(value as any) ? parseFloat(value) : NaN);

    if (this.props.onChange) {
      this.props.onChange(newValue);
    }

    this.setState({ invalid: newValue !== null && isNaN(newValue) });
  }
}
