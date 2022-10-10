import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import classNames from "classnames";
import { useDebounce } from "./input-utils";
import { InputProps } from "./common";

interface FullDateInputProps extends InputProps<Date> {
  id?: string;
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
  const init = getInitialFullDateState(props);
  const [day, setDay] = useState<string>(init.day);
  const [month, setMonth] = useState<string>(init.month);
  const [year, setYear] = useState<string>(init.year);

  const dayName = `${props.name}_day`;
  const monthName = `${props.name}_month`;
  const yearName = `${props.name}_year`;

  const inputClass = classNames("govuk-input", "govuk-date-input__input", {
    "govuk-input--error": props.hasError === true,
  });

  const debouncedChange = useDebounce(props.onChange, props.debounce);

  useEffect(() => {
    if (props.onChange) {
      // Create a datetime with the set year/month/day
      let date = DateTime.local(Number(year), Number(month), Number(day));

      // Set our time to mid-day
      date = date.set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0,
      });

      // If we have a valid date, return that JS Date object.
      if (date.isValid) {
        debouncedChange(date.toJSDate());
      } else if (day !== "" || month !== "" || year !== "") {
        // Return an invalid date.
        debouncedChange(new Date(NaN));
      } else {
        // If the day/month/year is empty, just return null.
        debouncedChange(null);
      }
    }
  }, [day, month, year, props, debouncedChange]);

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
            value={day}
            onChange={e => setDay(e.currentTarget.value)}
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
            value={month}
            onChange={e => setMonth(e.currentTarget.value)}
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
            value={year}
            onChange={e => setYear(e.currentTarget.value)}
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
  const init = getInitialMonthYearState(props);
  const [month, setMonth] = useState<string>(init.month);
  const [year, setYear] = useState<string>(init.year);

  const monthName = `${props.name}_month`;
  const yearName = `${props.name}_year`;

  const inputClass = classNames("govuk-input", "govuk-date-input__input", {
    "govuk-input--error": props.hasError === true,
  });

  const debouncedChange = useDebounce(props.onChange, props.debounce);

  useEffect(() => {
    if (props.onChange) {
      const { startOrEnd } = props;

      // Create a datetime with the set year/month
      let date = DateTime.local(Number(year), Number(month));

      // Align our day to the start/end of the month
      if (startOrEnd === "start") {
        date = date.startOf("month");
      } else {
        date = date.endOf("month");
      }

      // Set our time to mid-day
      date = date.set({
        hour: 12,
        minute: 0,
        second: 0,
        millisecond: 0,
      });

      // If we have a valid date, return that JS Date object.
      if (date.isValid) {
        debouncedChange(date.toJSDate());
      } else if (month !== "" || year !== "") {
        // Return an invalid date.
        debouncedChange(new Date(NaN));
      } else {
        // If the month/year is empty, just return null.
        debouncedChange(null);
      }
    }
  }, [month, year, props, debouncedChange]);

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
            value={month}
            onChange={e => setMonth(e.currentTarget.value)}
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
            value={year}
            onChange={e => setYear(e.currentTarget.value)}
          />
        </div>
      </div>
    </div>
  );
}
