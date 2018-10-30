import { DateTime } from "luxon";

export interface IClock {
  today(): Date;
  parse(value: string|null|undefined, format: string): Date|null;
}

export class Clock implements IClock {
  today() {
    return new Date();
  }

  parse(value: string|null|undefined, format: string) {
    if(!value) {
      return null;
    }
    const result = DateTime.fromFormat(value, format);
    return result.toLocal().toJSDate();
  }
}
