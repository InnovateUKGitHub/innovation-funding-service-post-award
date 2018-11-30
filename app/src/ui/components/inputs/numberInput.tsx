import React from "react";
import classNames from "classnames";
import { BaseInput } from "./baseInput";

interface NumberInputProps extends InputProps<number> {
  className?: string;
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
    // if both new and current is nan then dont change
    if (nextProps.value !== this.props.value && !(isNaN(nextProps.value!) && !isFinite(this.state.value as any))) {
      this.setState(this.getStateFromProps(nextProps));
      this.cancelTimeout();
    }
  }

  public render() {
    return (
      <input
        type="text"
        className={classNames("govuk-input", "govuk-table__cell--numeric", { "govuk-input--error": this.state.invalid }, this.props.className)}
        name={this.props.name}
        value={this.state.value}
        disabled={!!this.props.disabled}
        onChange={x => this.handleChange(x, true)}
        onBlur={x => this.handleChange(x, false)}
      />
    );
  }

  private getStateFromProps(props: NumberInputProps): NumberInputState {
    return {
      value: props.value && props.value.toString() || "",
      invalid: !!props.value && isNaN(props.value)
    };
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>, debounce: boolean) => {
    const value = e.currentTarget.value;
    if (this.state.value !== value) {
      this.setState({ value });
      debounce ? this.debounce(() => this.changeNow(value), 250) : this.changeNow(value);

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
