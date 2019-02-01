import { DateTime } from "luxon";
import { SyncQueryBase } from "../common";
import { ClaimFrequency, IContext } from "../../../types";

interface PeriodInfo {
  current: number;
  total: number | null;
  startDate: Date | null;
  endDate: Date | null;
}

export class GetPeriodInfoQuery extends SyncQueryBase<PeriodInfo> {
  constructor(
    private readonly startDate: Date,
    private readonly endDate: Date,
    private readonly claimFrequency: ClaimFrequency
  ) {
    super();
  }

  protected Run(context: IContext): PeriodInfo {
    const start = DateTime.fromJSDate(this.startDate);
    const end = DateTime.fromJSDate(this.endDate);
    const now = DateTime.fromJSDate(context.clock.today());

    // if project is still in progress use today otherwise day before end so in last period
    const dateForCurrentPeriod = end.isValid && end < now ? end.minus({ days: 1 }) : now;
    const monthsForCurrent = dateForCurrentPeriod.diff(start, "months").months;

    // if valid end date isnt supplied use null so we can return a total value of null
    const monthsForTotal = end.isValid ? end.diff(start, "months").months : null;
    const factor = this.claimFrequency as number;

    const current = monthsForCurrent >= 0 ? Math.floor(monthsForCurrent / factor) + 1 : 0;
    const total = monthsForTotal !== null && monthsForTotal >= 0 ? Math.ceil(monthsForTotal / factor) : null;

    const startDate = current !== 0 ? start.plus({ months: factor * (current - 1) }).toJSDate() : null;
    const endDate = current !== 0 ? start.plus({ months: factor * (current) }).minus({ days: 1 }).toJSDate() : null;

    return { current, total, startDate, endDate };
  }
}
