import { DateTime } from "luxon";

export const convertDateAndTime = (jsDate: Date | null): DateTime | null => {
  return jsDate && DateTime.fromJSDate(jsDate).setZone("Europe/London");
};

const appendMeridian = (date: DateTime | null, format: string) => {
  if (date && date.isValid) {
    return format + (date.hour >= 12 ? "'pm'" : "'am'");
  }
  return format;
};

export enum DateFormat {
  FULL_DATE,
  SHORT_DATE,
  FULL_DATE_TIME,
  SHORT_DATE_TIME,
  SHORT_MONTH,
  DAY_AND_LONG_MONTH,
  LONG_YEAR,
  MONTH_YEAR,
}

export const formatDate = (jsDate: Date | null | undefined, format: DateFormat) => {
  if (!jsDate) return null;
  // tslint:disable:no-small-switch
  const date = convertDateAndTime(jsDate);
  if (!date || !date.isValid) return "INVALID DATE FORMAT";

  switch (format) {
    case DateFormat.FULL_DATE: {
      return date.toFormat("d MMMM yyyy");
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
    default: return "INVALID DATE FORMAT";
  }
};
