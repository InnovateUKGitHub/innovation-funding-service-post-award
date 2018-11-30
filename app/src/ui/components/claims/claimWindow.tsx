import React from "react";
import { FullDate } from "../renderers";
import { DateTime } from "luxon";

interface Props {
  periodEnd: Date;
}

export const ClaimWindow: React.SFC<Props> = (props) => {
  const today = DateTime.local().set({ hour: 0, minute: 0, second: 0 });
  const windowStart = DateTime.fromJSDate(props.periodEnd).plus({ days: 1 }).set({ hour: 0, minute: 0, second: 0 });
  const windowEnd = windowStart.plus({ days: 29 });

  const days = Math.ceil(windowEnd.diff(today, "days").days);
  // if before period end date then display UpcomingPeriodInfo
  if (today < windowStart) {
    return (
      <div style={{ textAlign: "center" }}>
        <h3 className="govuk-heading-s govuk-!-margin-bottom-2">Next claim period</h3>
        <p className="govuk-body govuk-!-margin-bottom-1 govuk-!-font-size-16"><strong>Begins</strong> <FullDate value={windowStart.toJSDate()} /></p>
        <p className="govuk-body govuk-!-margin-bottom-1 govuk-!-font-size-16"><strong>Ends</strong> <FullDate value={windowEnd.toJSDate()} /></p>
      </div>
    );
  }

  // if before period end + 30 then display InPeriod Info
  if (days >= 0) {
    return (
      <div style={{ textAlign: "center" }}>
        <h3 className="govuk-heading-m govuk-!-margin-bottom-2">{days + 1}</h3>
        <p className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16">days left of claim period</p>
        <p className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16">deadline <FullDate value={windowEnd.toJSDate()} /></p>
      </div>
    );
  }

  // if after period end + 30 then display Overdue Info
  return (
    <div style={{ textAlign: "center" }}>
      <h3 className="govuk-heading-m govuk-!-margin-bottom-2" style={{ color: "#b10e1e" }}>{(days * -1)}</h3>
      <p className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16" style={{ color: "#b10e1e" }}>days past claim period</p>
      <p className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16" style={{ color: "#b10e1e" }}>deadline <FullDate value={windowEnd.toJSDate()} /></p>
    </div>
  );
};
