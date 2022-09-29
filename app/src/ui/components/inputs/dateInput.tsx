import { useState } from "react";
import { DateTime } from "luxon";
import classNames from "classnames";
import { useDebounce } from "./input-utils";
import { InputProps } from "./common";

interface FullDateInputProps extends InputProps<Date> {
  id?: string;
}

interface FullDateState {
  day: string;
  month: string;
  year: string;
}

const getInitialFullDateState = (props: FullDateInputProps) => {
  const val = props.value && DateTime.fromJSDate(props.value);

  if (val && val.isValid) {
    return {
      day: val.toFormat("dd"),
      month: val.toFormat("MM"),
      year: val.toFormat("yyyy"),
    };
  } else {
    return {
      day: "",
      month: "",
      year: "",
    };
  }
};

export function FullDateInput(props: FullDateInputProps) {
  const [state, setState] = useState<FullDateState>(getInitialFullDateState(props));

  const dayName = `${props.name}_day`;
  const monthName = `${props.name}_month`;
  const yearName = `${props.name}_year`;

  const inputClass = classNames("govuk-input", "govuk-date-input__input", {
    "govuk-input--error": props.hasError === true,
  });

  const sendUpdate = () => {
    if (props.onChange) {
      const { day, month, year } = state;

      const result = DateTime.fromFormat(`${day}/${month}/${year}`, "d/M/yyyy").set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0,
      });

      if (result.isValid) {
        props.onChange(result.toJSDate());
      } else if (day !== "" || month !== "" || year !== "") {
        props.onChange(new Date(NaN));
      } else {
        props.onChange(null);
      }
    }
  };
  const debouncedSendUpdate = useDebounce(sendUpdate, props.debounce, 500);

  const handleChange = (day: string, month: string, year: string) => {
    setState({ day, month, year });
    if (debouncedSendUpdate) {
      debouncedSendUpdate();
    }
  };

  return (
    <div id={props.id} className="govuk-date-input">
      <div className="govuk-date-input__item">
        <div className="govuk-form-group">
          <label className="govuk-label govuk-date-input__label" htmlFor={dayName}>
            Day
          </label>
          <input
            className={classNames(inputClass, "govuk-input--width-2")}
            name={dayName}
            id={dayName}
            type="text"
            pattern="[0-9]*"
            disabled={!!props.disabled}
            aria-label={props.ariaLabel && `${props.ariaLabel} day`}
            aria-describedby={props.ariaDescribedBy}
            value={state.day}
            onChange={e => handleChange(e.currentTarget.value, state.month, state.year)}
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
            id={monthName}
            type="text"
            pattern="[0-9]*"
            disabled={!!props.disabled}
            aria-label={props.ariaLabel && `${props.ariaLabel} month`}
            aria-describedby={props.ariaDescribedBy}
            value={state.month}
            onChange={e => handleChange(state.day, e.currentTarget.value, state.year)}
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
            id={yearName}
            type="text"
            pattern="[0-9]*"
            disabled={!!props.disabled}
            aria-label={props.ariaLabel && `${props.ariaLabel} year`}
            aria-describedby={props.ariaDescribedBy}
            value={state.year}
            onChange={e => handleChange(state.day, state.month, e.currentTarget.value)}
          />
        </div>
      </div>
    </div>
  );
}

interface MonthYearInputProps extends InputProps<Date> {
  startOrEnd: "start" | "end";
  hideLabel?: boolean;
}

interface MonthYearState {
  month: string;
  year: string;
}

const getInitialMonthYearState = (props: FullDateInputProps) => {
  const val = props.value && DateTime.fromJSDate(props.value);

  if (val && val.isValid) {
    return {
      month: val.toFormat("MM"),
      year: val.toFormat("yyyy"),
    };
  } else {
    return {
      month: "",
      year: "",
    };
  }
};

export function MonthYearInput(props: MonthYearInputProps) {
  const [state, setState] = useState<MonthYearState>(getInitialMonthYearState(props));

  const monthName = `${props.name}_month`;
  const yearName = `${props.name}_year`;

  const inputClass = classNames("govuk-input", "govuk-date-input__input", {
    "govuk-input--error": props.hasError === true,
  });

  const sendUpdate = () => {
    if (props.onChange) {
      const { month, year } = state;
      const { startOrEnd } = props;

      const date = DateTime.fromFormat(`${month}/${year}`, "M/yyyy");

      const result = (startOrEnd === "start" ? date.startOf("month") : date.endOf("month")).set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0,
      });

      if (result.isValid) {
        props.onChange(result.toJSDate());
      } else if (month !== "" || year !== "") {
        props.onChange(new Date(NaN));
      } else {
        props.onChange(null);
      }
    }
  };

  const debouncedSendUpdate = useDebounce(sendUpdate, props.debounce, 500);

  const handleChange = (month: string, year: string) => {
    setState({ month, year });
    if (debouncedSendUpdate) {
      debouncedSendUpdate();
    }
  };

  return (
    <div className="govuk-date-input">
      <div className="govuk-date-input__item">
        <div className="govuk-form-group">
          {!props.hideLabel && (
            <label className="govuk-label govuk-date-input__label" htmlFor={monthName}>
              Month
            </label>
          )}
          <input
            className={classNames(inputClass, "govuk-input--width-2")}
            name={monthName}
            id={monthName}
            type="text"
            pattern="[0-9]*"
            disabled={!!props.disabled}
            aria-label={props.ariaLabel && `${props.ariaLabel} month`}
            aria-describedby={props.ariaDescribedBy}
            value={state.month}
            onChange={e => handleChange(e.currentTarget.value, state.year)}
          />
        </div>
      </div>
      <div className="govuk-date-input__item">
        <div className="govuk-form-group">
          {!props.hideLabel && (
            <label className="govuk-label govuk-date-input__label" htmlFor={yearName}>
              Year
            </label>
          )}
          <input
            className={classNames(inputClass, "govuk-input--width-4")}
            name={yearName}
            id={yearName}
            type="text"
            pattern="[0-9]*"
            disabled={!!props.disabled}
            aria-label={props.ariaLabel && `${props.ariaLabel} year`}
            aria-describedby={props.ariaDescribedBy}
            value={state.year}
            onChange={e => handleChange(state.month, e.currentTarget.value)}
          />
        </div>
      </div>
    </div>
  );
}
