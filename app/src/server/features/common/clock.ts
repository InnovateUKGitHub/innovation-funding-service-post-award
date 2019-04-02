import { DateTime } from "luxon";

export const SALESFORCE_DATE_FORMAT = "yyyy-MM-dd";

export interface IClock {
  today(): Date;
  parse(value: string|null|undefined, format: string): Date|null;
  dateTime(value: Date): DateTime;
  dateTime(value: string, format: string): DateTime;
}

export class Clock implements IClock {
  today() {
    return new Date();
  }

  parse(value: string|null|undefined, format: string): Date|null {
    if(!value) {
      return null;
    }

    return this.dateTime(value, format).toJSDate();
  }

  dateTime(value: Date|string, format?: string): DateTime {
    const localOpts = { locale: "en-GB", zone: "Europe/London" };

    return typeof value === "string"
      ? DateTime.fromFormat(value, format!, localOpts)
      : DateTime.fromJSDate(value, localOpts);
  }
}
