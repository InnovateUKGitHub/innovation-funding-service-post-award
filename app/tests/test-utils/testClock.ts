import { DateTime } from "luxon";
import { Clock, IClock } from "../../src/framework/util/clock";

export class TestClock implements IClock {
  private testClockNow: Date | null;
  private readonly inner: Clock;

  constructor() {
    this.testClockNow = null;
    this.inner = new Clock();
  }

  public setDate(value: string, format = "yyyy/MM/dd") {
    return this.setDateTime(value + " 12:00:00", format + " HH:mm:ss");
  }

  public setDateTime(value: string, format = "yyyy/MM/dd hh:mm:ss") {
    const parsed = this.parse(value, format);
    if (!parsed || isNaN(parsed.getTime())) {
      throw new Error(`Invalid date for format ${value} ${format}`);
    }
    return (this.testClockNow = this.parse(value, format));
  }

  now(): Date {
    return this.testClockNow || new Date();
  }

  parse(value: string, format: string) {
    return this.inner.parse(value, format);
  }

  dateTime(value: Date | string, format?: string) {
    return this.inner.dateTime(value, format);
  }

  asLuxon(): DateTime {
    return DateTime.fromJSDate(this.now());
  }

  parseOptionalSalesforceDate(value: string): Date | null {
    return this.inner.parseOptionalSalesforceDate(value);
  }

  formatOptionalSalesforceDate(jsDate?: Date | null): string | null {
    return this.inner.formatOptionalSalesforceDate(jsDate);
  }

  formatRequiredSalesforceDate(jsDate: Date): string {
    return this.inner.formatRequiredSalesforceDate(jsDate);
  }

  parseRequiredSalesforceDate(value: string): Date {
    return this.inner.parseRequiredSalesforceDate(value);
  }

  parseOptionalSalesforceDateTime(value: string): Date | null {
    return this.inner.parseOptionalSalesforceDateTime(value);
  }

  parseRequiredSalesforceDateTime(value: string): Date {
    return this.inner.parseRequiredSalesforceDateTime(value);
  }
}
