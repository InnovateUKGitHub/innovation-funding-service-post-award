import { DateFormat } from "@framework/constants/enums";
import { DateTime } from "luxon";
import { ReactNode } from "react";

export type DateConvertible = Date | string | null | undefined;
export const convertDateAndTime = (date: DateConvertible): DateTime | null => {
  if (typeof date === "string") {
    // Attempt to parse "2020-01-04" style dates
    const format1 = DateTime.fromFormat(date, "yyyy-MM-dd");
    // If the date is valid, use that.
    if (format1.isValid) return format1;

    // Otherwise, try to parse ISO dates.
    const format2 = DateTime.fromISO(date);
    // Even if the date is invalid, return it.
    return format2;
  }
  if (typeof date === "undefined") return null;
  return date && DateTime.fromJSDate(date).setZone("Europe/London");
};

const appendMeridian = (date: DateTime, format: string) => format + (date.hour >= 12 ? "'pm'" : "'am'");

export const formatDate = (
  jsDate: DateConvertible,
  format: DateFormat,
  invalidDisplay: ReactNode = "INVALID DATE FORMAT",
  nullDisplay: ReactNode = null,
): ReactNode => {
  if (!jsDate) return nullDisplay;
  const date = convertDateAndTime(jsDate);
  if (!date || !date.isValid) return invalidDisplay;

  switch (format) {
    case DateFormat.FULL_DATE: {
      return date.toFormat("d MMMM yyyy");
    }
    case DateFormat.FULL_NUMERIC_DATE: {
      return date.toFormat("dd/MM/yyyy");
    }
    case DateFormat.SHORT_DATE: {
      return date.toFormat("d MMM yyyy");
    }
    case DateFormat.FULL_DATE_TIME: {
      return date.toFormat(appendMeridian(date, "d MMMM yyyy, h:mm"));
    }
    case DateFormat.SHORT_DATE_TIME: {
      return date.toFormat(appendMeridian(date, "d MMM yyyy, h:mm"));
    }
    case DateFormat.SHORT_MONTH: {
      return date.toFormat("MMM");
    }
    case DateFormat.DAY_AND_LONG_MONTH: {
      return date.toFormat("d MMMM");
    }
    case DateFormat.LONG_YEAR: {
      return date.toFormat("yyyy");
    }
    case DateFormat.MONTH_YEAR: {
      return date.toFormat("MMMM yyyy");
    }
    case DateFormat.SHORT_MONTH_YEAR: {
      return date.toFormat("MMM yyyy");
    }
    default:
      return "INVALID DATE FORMAT";
  }
};
