import { DateFormat } from "@framework/constants";
import { DateTime } from "luxon";

export type DateConvertible = Date | string | null | undefined;
export const convertDateAndTime = (date: DateConvertible): DateTime | null => {
  if (typeof date === "string") return DateTime.fromFormat(date, "yyyy-MM-dd");
  if (typeof date === "undefined") return null;
  return date && DateTime.fromJSDate(date).setZone("Europe/London");
};

const appendMeridian = (date: DateTime, format: string) => format + (date.hour >= 12 ? "'pm'" : "'am'");

export const formatDate = (jsDate: DateConvertible, format: DateFormat) => {
  if (!jsDate) return null;
  const date = convertDateAndTime(jsDate);
  if (!date || !date.isValid) return "INVALID DATE FORMAT";

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
    default:
      return "INVALID DATE FORMAT";
  }
};
