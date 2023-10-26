import React, { ReactNode } from "react";
import { DateTime } from "luxon";
import { DateFormat } from "@framework/constants/enums";
import { DateConvertible, formatDate, convertDateAndTime } from "@framework/util/dateHelpers";

export interface BaseDateProps {
  invalidDisplay?: ReactNode;
  nullDisplay?: ReactNode;
}

interface DateProps extends BaseDateProps {
  value: DateConvertible;
}

const render = ({ value, invalidDisplay, nullDisplay }: DateProps, format: DateFormat) => {
  const date = formatDate(value, format, invalidDisplay, nullDisplay);
  return date ? <span>{date}</span> : null;
};

const renderDateRange = (start: DateTime | null, end: DateTime | null, format: string, isCondensed = false) => {
  if (!start || !start.isValid || !end || !end.isValid) {
    return null;
  }

  if (start.month === end.month && start.year === end.year && isCondensed) {
    return <span style={{ whiteSpace: "nowrap" }}>{end.toFormat(format + " yyyy")}</span>;
  }

  if (start.year === end.year) {
    return (
      <span>
        <span style={{ whiteSpace: "nowrap" }}>{start.toFormat(format)} to </span>
        <span style={{ whiteSpace: "nowrap" }}>{end.toFormat(format + " yyyy")}</span>
      </span>
    );
  }

  return (
    <span>
      <span style={{ whiteSpace: "nowrap" }}>{start.toFormat(format + " yyyy")} to </span>
      <span style={{ whiteSpace: "nowrap" }}>{end.toFormat(format + " yyyy")}</span>
    </span>
  );
};

export const CondensedDateRange: React.FunctionComponent<{ start: DateConvertible; end: DateConvertible }> = props => {
  return renderDateRange(convertDateAndTime(props.start), convertDateAndTime(props.end), "MMM", true);
};

export const LongDateRange: React.FunctionComponent<{ start: DateConvertible; end: DateConvertible }> = props => {
  return renderDateRange(convertDateAndTime(props.start), convertDateAndTime(props.end), "d MMMM");
};

export const ShortDateRange: React.FunctionComponent<{ start: DateConvertible; end: DateConvertible }> = props => {
  return renderDateRange(convertDateAndTime(props.start), convertDateAndTime(props.end), "d MMM");
};

export const ShortMonth: React.FunctionComponent<DateProps> = props => {
  return render(props, DateFormat.SHORT_MONTH);
};

export const DayAndLongMonth: React.FunctionComponent<DateProps> = props => {
  return render(props, DateFormat.DAY_AND_LONG_MONTH);
};

export const LongYear: React.FunctionComponent<DateProps> = props => {
  return render(props, DateFormat.LONG_YEAR);
};

export const MonthYear: React.FunctionComponent<DateProps> = props => {
  return render(props, DateFormat.MONTH_YEAR);
};

export const FullDate: React.FunctionComponent<DateProps> = props => {
  return render(props, DateFormat.FULL_DATE);
};

export const FullNumericDate: React.FunctionComponent<DateProps> = props => {
  return render(props, DateFormat.FULL_NUMERIC_DATE);
};

export const FullDateTime: React.FunctionComponent<DateProps> = props => {
  return render(props, DateFormat.FULL_DATE_TIME);
};

export const ShortDate: React.FunctionComponent<DateProps> = props => {
  return render(props, DateFormat.SHORT_DATE);
};

export const ShortDateTime: React.FunctionComponent<DateProps> = props => {
  return render(props, DateFormat.SHORT_DATE_TIME);
};

export const Duration: React.FunctionComponent<{ startDate: DateConvertible; endDate: DateConvertible }> = props => {
  const startDateLuxon = convertDateAndTime(props.startDate);
  const endDateLuxon = convertDateAndTime(props.endDate);

  if (startDateLuxon && startDateLuxon.isValid && endDateLuxon && endDateLuxon.isValid) {
    const startOfNextMonthAfterEnd = endDateLuxon.plus({ months: 1 }).startOf("month");
    const startOfStartMonth = startDateLuxon.startOf("month");
    const monthsFromYears = (startOfNextMonthAfterEnd.year - startOfStartMonth.year) * 12;
    const remainingMonths = startOfNextMonthAfterEnd.month - startOfStartMonth.month;
    const months = monthsFromYears + remainingMonths;

    return <span>{`${months} ${months === 1 ? "month" : "months"}`}</span>;
  }

  return null;
};

export const Months: React.FunctionComponent<{ months: number | null }> = props => {
  if (props.months || props.months === 0) {
    return <span>{`${props.months} ${props.months === 1 ? "month" : "months"}`}</span>;
  }
  return null;
};

export const ShortDateRangeFromDuration = (props: { startDate: DateConvertible; months: number | null }) => {
  const startDateLuxon = convertDateAndTime(props.startDate);
  const isValidDuration = props.months && Number.isInteger(props.months);
  const endDate =
    startDateLuxon && isValidDuration
      ? startDateLuxon
          .plus({ months: (props.months ?? 0) - 1 })
          .endOf("month")
          .toJSDate()
      : null;
  return <ShortDateRange start={props.startDate} end={endDate} />;
};

/**
 * Combines nullable month and year input strings into a date object
 */
export const combineDate = (month: Nullable<string>, year: Nullable<string>, fromStart: boolean) => {
  // set date to null if the fields are empty
  if (!month && !year) return null;
  let date = DateTime.local(Number(year), Number(month));
  // set date to start of month
  if (fromStart) {
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

  if (date.isValid) {
    return date.toJSDate();
  } else {
    throw new Error("the date is invalid");
  }
};

/**
 * returns the month from a date object as string
 */
export const getMonth = (date: Date | null) => {
  if (!date) return "";

  return String(DateTime.fromJSDate(date).month);
};

/**
 * returns the year from a date object as string
 */
export const getYear = (date: Date | null) => {
  if (!date) return "";

  return String(DateTime.fromJSDate(date).year);
};
