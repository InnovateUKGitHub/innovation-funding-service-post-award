import { IClock, Clock } from "../../src/server/features/common/clock";

export class TestClock implements IClock {
    
    private _now : Date|null;
    private _inner: Clock;
    constructor() {
        this._now = null;
        this._inner = new Clock();
    }

    public setDate(value: string, format: string = "yyyy/MM/dd") {
        this.setDateTime(value+ " 12:00:00", format + " HH:mm:ss")
    }

    public setDateTime(value: string, format: string = "yyyy/MM/dd hh:mm:ss") {
        console.log("setting test clock", value, this.parse(value, format))
        return this._now = this.parse(value, format);
    }

    today(): Date {
        return this._now || new Date();
    }

    parse(value: string, format: string) {
        return this._inner.parse(value, format);
    }
    
}