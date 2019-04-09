import { Clock, IClock } from "../../src/server/features/common/clock";
import { DateTime } from "luxon";

export class TestClock implements IClock {
    private _now: Date|null;
    private _inner: Clock;

    constructor() {
        this._now = null;
        this._inner = new Clock();
    }

    public setDate(value: string, format: string = "yyyy/MM/dd") {
        return this.setDateTime(value+ " 12:00:00", format + " HH:mm:ss");
    }

    public setDateTime(value: string, format: string = "yyyy/MM/dd hh:mm:ss") {
        const parsed = this.parse(value, format);
        if(!parsed || isNaN(parsed.getTime())) {
            throw new Error(`Invalid date for format ${value} ${format}`);
        }
        return this._now = this.parse(value, format);
    }

    today(): Date {
        return this._now || new Date();
    }

    parse(value: string, format: string) {
        return this._inner.parse(value, format);
    }

    dateTime(value: Date|string, format?: string) {
      return this._inner.dateTime(value, format);
    }

    asLuxon(): DateTime {
        return DateTime.fromJSDate(this.today());
    }

}
