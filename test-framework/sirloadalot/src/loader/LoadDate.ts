export type LoadableDate =
  | RelativeDate
  | AbsoluteDate
  | (RelativeDate & AbsoluteDate);

export interface RelativeDate {
  /**
   * Set the date as the current date/time, with a specified offset.
   * Skipped inputs will retain the current value.
   */
  offset: Partial<DateInput> | "none";
}

export interface AbsoluteDate {
  /**
   * Set the date to a specific date/time.
   * Skipped inputs will retain the current value.
   */
  date: Partial<DateInput> | "now";
}

interface DateInput {
  /**
   * @asType integer
   */
  year: number;
  /**
   * @asType integer
   */
  month: number;
  /**
   * @asType integer
   */
  day: number;
  /**
   * @asType integer
   */
  hour: number;
  /**
   * @asType integer
   */
  minute: number;
}

interface LoadDateProps {
  date?: Date;
}

class LoadDate {
  date: Date;

  constructor({ date }: LoadDateProps) {
    // Clone the date, or create a new date.
    this.date = date ? new Date(date) : new Date();
  }

  setDate(input: LoadableDate): void {
    if ("date" in input) this.setAbsoluteDate(input);
    if ("offset" in input) this.setRelativeDate(input);
  }

  private setRelativeDate(input: RelativeDate): void {
    if (input.offset === "none") return;
    this.date.setUTCFullYear(
      this.date.getUTCFullYear() + (input.offset.year ?? 0),
      this.date.getUTCMonth() + (input.offset.month ?? 0),
      this.date.getUTCDate() + (input.offset.day ?? 0)
    );
    this.date.setUTCHours(
      this.date.getUTCHours() + (input.offset.hour ?? 0),
      this.date.getUTCMinutes() + (input.offset.minute ?? 0)
    );
  }

  private setAbsoluteDate(input: AbsoluteDate): void {
    if (input.date === "now") return;
    if (input.date.year !== undefined) {
      this.date.setUTCFullYear(input.date.year);
    }
    if (input.date.month !== undefined) {
      this.date.setUTCMonth(input.date.month - 1);
    }
    if (input.date.day !== undefined) {
      this.date.setUTCDate(input.date.day);
    }
    if (input.date.hour !== undefined) {
      this.date.setUTCHours(input.date.hour);
    }
    if (input.date.minute !== undefined) {
      this.date.setUTCMinutes(input.date.minute);
    }
  }

  toSalesforceDate(): string {
    return this.date.toISOString().replace("T", " ").substring(0, 16);
  }
}

export { LoadDate };
