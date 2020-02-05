import { DateTime } from "luxon";

export const SALESFORCE_DATE_FORMAT = "yyyy-MM-dd";

export interface IClock {
  now(): Date;
  parse(value: string | null | undefined, format: string): Date | null;
  dateTime(value: Date): DateTime;
  dateTime(value: string, format: string): DateTime;
  parseOptionalSalesforceDate(value: string): Date | null;
  parseRequiredSalesforceDate(value: string): Date;
  parseOptionalSalesforceDateTime(value: string): Date | null;
  parseRequiredSalesforceDateTime(value: string): Date;
}

export class Clock implements IClock {
  now() {
    return new Date();
  }

  parseOptionalSalesforceDate(value: string| null): Date | null {
    if (!value) return null;
    const result = DateTime.fromFormat(value, SALESFORCE_DATE_FORMAT).setZone("Europe/London");
    if (!result.isValid) {
      throw new Error("Invalid Date: " + value);
    }
    return result.toJSDate();
  }

  parseRequiredSalesforceDate(value: string): Date {
    const result = this.parseOptionalSalesforceDate(value);
    if (!result) {
      throw new Error("Invalid Date: empty");
    }
    return result;
  }

  parseOptionalSalesforceDateTime(value: string|null): Date | null {
    if (!value) return null;
    const result = DateTime.fromISO(value);
    if (!result.isValid) {
      throw new Error("Invalid DateTime: " + value);
    }
    return result.toJSDate();
  }

  parseRequiredSalesforceDateTime(value: string): Date {
    const result = this.parseOptionalSalesforceDateTime(value);
    if (!result) {
      throw new Error("Invalid DateTime: empty");
    }
    return result;
  }

  parse(value: string | null | undefined, format: string): Date | null {
    if (!value) {
      return null;
    }

    return this.dateTime(value, format).toJSDate();
  }

  dateTime(value: Date | string, format?: string): DateTime {
    const localOpts = { locale: "en-GB", zone: "Europe/London" };

    return typeof value === "string"
      ? DateTime.fromFormat(value, format!, localOpts)
      : DateTime.fromJSDate(value, localOpts);
  }
}
