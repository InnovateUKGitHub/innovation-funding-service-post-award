// tslint:disable no-duplicate-string
import * as React from "react";
import { BaseInput } from "./baseInput";
import { DateTime } from "luxon";
import classNames from "classnames";

interface FullDateInputProps extends InputProps<Date> {

}

interface FullDateState {
  day: string;
  month: string;
  year: string;
}

export class FullDateInput extends BaseInput<FullDateInputProps, FullDateState> {
  constructor(props: FullDateInputProps) {
    super(props);
    const val = this.props.value && DateTime.fromJSDate(this.props.value);

    if (val && val.isValid) {
      this.state = {
        day: val.toFormat("dd"),
        month: val.toFormat("MM"),
        year: val.toFormat("yyyy")
      };
    }
    else {
      this.state = {
        day: "",
        month: "",
        year: ""
      };
    }
  }

  render() {
    const dayName = `${this.props.name}_day`;
    const monthName = `${this.props.name}_month`;
    const yearName = `${this.props.name}_year`;

    const inputClass = classNames(
      "govuk-input",
      "govuk-date-input__input",
      { "govuk-input--error": this.props.hasError === true }
    );

    return (
      <div className="govuk-date-input">
        <div className="govuk-date-input__item">
          <div className="govuk-form-group">
            <label className="govuk-label govuk-date-input__label" htmlFor={dayName}>
              Day
          </label>
            <input
              className={classNames(inputClass, "govuk-input--width-2")}
              name={dayName}
              type="number"
              pattern="[0-9]*"
              disabled={!!this.props.disabled}
              aria-label={this.props.ariaLabel && `${this.props.ariaLabel} day`}
              aria-describedby={this.props.ariaDescribedBy}
              aria-valuemin={1}
              aria-valuemax={31}
              aria-valuenow={getIfNumber(this.state.day)}
              value={this.state.day}
              onChange={e => this.onChange(e.currentTarget.value, this.state.month, this.state.year)}
            />
          </div>
        </div>
        <div className="govuk-date-input__item">
          <div className="govuk-form-group">
            <label className="govuk-label govuk-date-input__label" htmlFor={monthName}>
              Month
          </label>
            <input
              className={classNames(inputClass, "govuk-input--width-2")}
              name={monthName}
              type="number"
              pattern="[0-9]*"
              disabled={!!this.props.disabled}
              aria-label={this.props.ariaLabel && `${this.props.ariaLabel} month`}
              aria-describedby={this.props.ariaDescribedBy}
              aria-valuemin={1}
              aria-valuemax={12}
              aria-valuenow={getIfNumber(this.state.month)}
              value={this.state.month}
              onChange={e => this.onChange(this.state.day, e.currentTarget.value, this.state.year)}
            />
          </div>
        </div>
        <div className="govuk-date-input__item">
          <div className="govuk-form-group">
            <label className="govuk-label govuk-date-input__label" htmlFor={yearName}>
              Year
          </label>
            <input
              className={classNames(inputClass, "govuk-input--width-4")}
              name={yearName}
              type="number"
              pattern="[0-9]*"
              disabled={!!this.props.disabled}
              aria-label={this.props.ariaLabel && `${this.props.ariaLabel} year`}
              aria-describedby={this.props.ariaDescribedBy}
              aria-valuemin={1000}
              aria-valuemax={3000}
              aria-valuenow={getIfNumber(this.state.year)}
              value={this.state.year}
              onChange={e => this.onChange(this.state.day, this.state.month, e.currentTarget.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  private onChange(day: string, month: string, year: string) {
    this.setState({ day, month, year });
    this.debounce(() => this.sendUpdate(), 500);
  }

  private sendUpdate() {
    if (this.props.onChange) {
      const { day, month, year } = this.state;
      const result = DateTime.fromFormat(`${day}/${month}/${year}`, "d/M/yyyy");

      if (result.isValid) {
        this.props.onChange(result.toJSDate());
      }
      else if (day !== "" || month !== "" || year !== "") {
        this.props.onChange(new Date(NaN));
      }
      else {
        this.props.onChange(null);
      }
    }
  }
}

interface MonthYearInputProps extends InputProps<Date> {
  startOrEnd: "start" | "end";
}

interface MonthYearState {
  month: string;
  year: string;
}

export class MonthYearInput extends BaseInput<MonthYearInputProps, MonthYearState> {
  constructor(props: MonthYearInputProps) {
    super(props);
    const val = this.props.value && DateTime.fromJSDate(this.props.value);

    if (val && val.isValid) {
      this.state = {
        month: val.toFormat("MM"),
        year: val.toFormat("yyyy")
      };
    }
    else {
      this.state = {
        month: "",
        year: ""
      };
    }
  }

  render() {
    const monthName = `${this.props.name}_month`;
    const yearName = `${this.props.name}_year`;

    const inputClass = classNames(
      "govuk-input",
      "govuk-date-input__input",
      { "govuk-input--error": this.props.hasError === true }
    );

    return (
      <div className="govuk-date-input">
        <div className="govuk-date-input__item">
          <div className="govuk-form-group">
            <label className="govuk-label govuk-date-input__label" htmlFor={monthName}>
              Month
            </label>
            <input
              className={classNames(inputClass, "govuk-input--width-2")}
              name={monthName}
              type="number"
              pattern="[0-9]*"
              disabled={!!this.props.disabled}
              aria-label={this.props.ariaLabel && `${this.props.ariaLabel} month`}
              aria-describedby={this.props.ariaDescribedBy}
              aria-valuemin={1}
              aria-valuemax={12}
              aria-valuenow={getIfNumber(this.state.month)}
              value={this.state.month}
              onChange={e => this.onChange(e.currentTarget.value, this.state.year)}
            />
          </div>
        </div>
        <div className="govuk-date-input__item">
          <div className="govuk-form-group">
            <label className="govuk-label govuk-date-input__label" htmlFor={yearName}>
              Year
            </label>
            <input
              className={classNames(inputClass, "govuk-input--width-4")}
              name={yearName}
              type="number"
              pattern="[0-9]*"
              disabled={!!this.props.disabled}
              aria-label={this.props.ariaLabel && `${this.props.ariaLabel} year`}
              aria-describedby={this.props.ariaDescribedBy}
              aria-valuemin={1000}
              aria-valuemax={3000}
              aria-valuenow={getIfNumber(this.state.year)}
              value={this.state.year}
              onChange={e => this.onChange(this.state.month, e.currentTarget.value)}
            />
          </div>
        </div>
      </div>
    );
  }

  private onChange(month: string, year: string) {
    this.setState({ month, year });
    this.debounce(() => this.sendUpdate(month), 500);
  }

  private sendUpdate(monthInput: string) {
    const monthDateTime = DateTime.fromFormat(monthInput, "M");
    const day = this.props.startOrEnd === "start" ? "01" : monthDateTime.endOf("month").get("day");

    if (this.props.onChange) {
      const { month, year } = this.state;
      const result = DateTime.fromFormat(`${day}/${month}/${year}`, "d/M/yyyy");

      if (result.isValid) {
        this.props.onChange(result.toJSDate());
      }
      else if (month !== "" || year !== "") {
        this.props.onChange(new Date(NaN));
      }
      else {
        this.props.onChange(null);
      }
    }
  }
}

function getIfNumber(value: string) {
  const result = parseInt(value, 10);
  if (!isNaN(result)) {
    return result;
  }
  return undefined;
}
