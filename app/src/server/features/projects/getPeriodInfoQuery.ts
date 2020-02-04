import { DateTime } from "luxon";
import { SyncQueryBase } from "../common";
import { ClaimFrequency, IContext } from "@framework/types";

interface PeriodInfo {
  current: number;
  total: number | null;
  startDate: Date | null;
  endDate: Date | null;
  currentClaimWindowStart: Date | null;
  currentClaimWindowEnd: Date | null;
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
    const start = context.clock.dateTime(this.startDate).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const end = context.clock.dateTime(this.endDate).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    const today = context.clock.dateTime(context.clock.now()).set({ hour: 0, minute: 0, second: 0, millisecond: 0 });

    // if project is still in progress use today otherwise day before end so in last period
    const dateWithinCurrentPeriod = end.isValid && end < today ? end.minus({ days: 1 }) : today;
    const monthsIntoProject = dateWithinCurrentPeriod.diff(start, "months").months;

    // if valid end date isnt supplied use null so we can return a total value of null
    const totalMonthsInProject = end.isValid ? end.diff(start, "months").months : null;
    const factor = this.claimFrequency as number;

    const currentPeriod = monthsIntoProject >= 0 ? Math.floor(monthsIntoProject / factor) + 1 : 0;
    const totalPeriods = totalMonthsInProject !== null && totalMonthsInProject >= 0 ? Math.ceil(totalMonthsInProject / factor) : null;

    const periodStartDate = currentPeriod !== 0 ? start.plus({ months: factor * (currentPeriod - 1) }) : null;

    let currentClaimWindowStart: DateTime | null = null;

    // if the project has ended and did so in last 30 days then in claim window
    if(end < today && end >= today.minus({days:30})) {
      currentClaimWindowStart = start.plus({ months: factor * (currentPeriod) });
    }
    // if the project is in progress and not first period and current period started in last 30 days then in claim window
    else if(end > today && currentPeriod > 1 && periodStartDate && periodStartDate > today.minus({days:30})) {
      currentClaimWindowStart = start.plus({ months: factor * (currentPeriod - 1) });
    }

    return {
      current: currentPeriod,
      total: totalPeriods,
      startDate: periodStartDate && periodStartDate.toJSDate(),
      endDate: periodStartDate && start.plus({ months: factor * (currentPeriod) }).minus({ days: 1 }).toJSDate(),
      currentClaimWindowStart: currentClaimWindowStart && currentClaimWindowStart.toJSDate(),
      currentClaimWindowEnd: currentClaimWindowStart && currentClaimWindowStart.plus({ days: 30 }).minus({ minutes: 1 }).toJSDate()
    };
  }
}
