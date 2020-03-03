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

  private hasChanged(nextProps: NumberInputProps) {
    // if value is NaN in incoming props and we have a string that is a number in the state value it is a change
    if (isNaN(nextProps.value!)) {
      return isFinite(this.state.value as any);
    }

    // if value is null or undefined in incoming props and the value in the state is not empty string it is a change
    if (nextProps.value === null || nextProps.value === undefined) {
      return this.state.value !== "";
    }

    // if value in incoming props is not equal to the string converted to number it is a change
    return parseFloat(this.state.value) !== nextProps.value;
  }

  public componentWillReceiveProps(nextProps: NumberInputProps) {
    // if both new and current is nan then don't change
    // also if current string in state once passed is equivalent don't change
    if (this.hasChanged(nextProps)) {
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
    if (props.value === null || props.value === undefined || isNaN(props.value)) {
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

    // empty string maps to null then use isFinite to handle parse float converting "1. 2" to "1" etc
    const newValue = value === "" ? null : (isFinite(value as any) ? parseFloat(value) : NaN);

    if (this.props.onChange) {
      this.props.onChange(newValue);
    }

    this.setState({ invalid: newValue !== null && isNaN(newValue) });
  }
}
