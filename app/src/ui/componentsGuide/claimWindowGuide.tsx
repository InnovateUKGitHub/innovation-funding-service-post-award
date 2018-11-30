import React from "react";
import { ClaimWindow } from "../components/claims";
import { DateTime } from "luxon";

const beforePeriodEndDate = DateTime.local().plus({months:1}).set({ day: 1 }).minus({days:1});
const inPeriodEndDate = DateTime.local().set({ day: 1 }).minus({days:1});
const overduePeriodEndDate = DateTime.local().minus({ months: 1 }).set({day:1}).minus({days:1});

export const claimWindowGuide: IGuide = {
  name: "Claim window",
  options: [
    {
      name: "Before period starts",
      comments: "If the period claiming for is the current month then the claim window will start on the 1st day of the next month and ",
      example: `<ClaimWindow periodEnd={new Date("${beforePeriodEndDate.toFormat("yyyy/MM/dd")}")} />`,
      render: () => <ClaimWindow periodEnd={beforePeriodEndDate.toJSDate()} />
    },
    {
      name: "During period",
      comments: "If the period claiming for ends last month then the claim window will start on the 1st day of the this month and the deadline will be 30 days after",
      example: `<ClaimWindow periodEnd={new Date("${inPeriodEndDate.toFormat("yyyy/MM/dd")}")} />`,
      render: () => <ClaimWindow periodEnd={inPeriodEndDate.toJSDate()} />
    },
    {
      name: "Overdue",
      comments: "If the period claiming for ends month before last then the claim window will start on the 1st day of the last month and the deadline will be 30 days after",
      example: `<ClaimWindow periodEnd={new Date("${overduePeriodEndDate.toFormat("yyyy/MM/dd")}")} />`,
      render: () => <ClaimWindow periodEnd={overduePeriodEndDate.toJSDate()} />
    }

  ]
};
