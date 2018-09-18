import { DateTime } from "luxon";

export interface IClock {
  today(): Date;
  parse(value: string, format: string): Date|null;
}

export class Clock implements IClock {
  today() {
    return new Date();
  }

  parse(value: string, format: string) {
    if(!value) {
      return null;
    }

    const result = DateTime.fromFormat(value, format);
    return result.toLocal().toJSDate();
  }
}
