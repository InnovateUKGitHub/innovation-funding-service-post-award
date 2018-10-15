import * as React from "react";
import { DateTime } from "luxon";

const renderDate = (value: Date | null, format: string) => {
    const dateValue = value && DateTime.fromJSDate(value);

    if (dateValue && dateValue.isValid) {
        return <span>{dateValue.toFormat(format)}</span>;
    }

    return null;
};

export const DateRange: React.SFC<{ start: Date|null, end: Date|null }> = props => {
  const start = props.start && DateTime.fromJSDate(props.start);
  const end   = props.end && DateTime.fromJSDate(props.end);

  if(!start || !start.isValid || !end || !end.isValid) {
    return null;
  }

  const words  = [start.monthShort, "to", end.monthShort, end.year];

  if(start.year !== end.year) {
    words.splice(1, 0, start.year);
  }

  return <span>{words.join(" ")}</span>;
};

export const ShortMonth: React.SFC<{ value: Date | null }> = (props) => {
    return renderDate(props.value, "MMM");
};

export const DayAndLongMonth: React.SFC<{ value: Date | null }> = (props) => {
    return renderDate(props.value, "d MMMM");
};

export const LongYear: React.SFC<{ value: Date | null }> = (props) => {
    return renderDate(props.value, "yyyy");
};

export const FullDate: React.SFC<{ value: Date | null }> = (props) => {
    return renderDate(props.value, "d MMMM yyyy");
};

export const FullDateTime: React.SFC<{ value: Date | null }> = (props) => {
    return renderDate(props.value, "d MMMM yyyy HH:mm");
};

export const FullDateTimeWithSeconds: React.SFC<{ value: Date | null }> = (props) => {
    return renderDate(props.value, "d MMMM yyyy HH:mm:ss");
};

export const ShortDate: React.SFC<{ value: Date | null }> = (props) => {
    return renderDate(props.value, "d MMM yyyy");
};

export const ShortDateTime: React.SFC<{ value: Date | null }> = (props) => {
    return renderDate(props.value, "d MMM yyyy HH:mm");
};
