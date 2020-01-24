import React from "react";
import { ShortDate } from "../renderers/date";
import { DateTime } from "luxon";

interface Props {
  periodEnd: Date;
}

export const ClaimWindow: React.FunctionComponent<Props> = (props) => {
  const localOpts = { locale: "en-GB", zone: "Europe/London" };
  const today = DateTime.local().setLocale(localOpts.locale).setZone(localOpts.zone).set({ hour: 0, minute: 0, second: 0 });
  const windowStart = DateTime.fromJSDate(props.periodEnd, localOpts).plus({ days: 1 }).set({ hour: 0, minute: 0, second: 0 });
  const windowEnd = windowStart.plus({ days: 29 });
  const days = Math.round(windowEnd.diff(today, "days").days);

  if(!windowStart.isValid) return null;

  // if before period end date then display UpcomingPeriodInfo
  if (today < windowStart) {
    return (
      <div style={{ textAlign: "center" }}>
        <p className="govuk-heading-s govuk-!-margin-bottom-2">Next claim period</p>
        <p className="govuk-body govuk-!-margin-bottom-1 govuk-!-font-size-16"><strong>Begins</strong> <ShortDate value={windowStart.toJSDate()} /></p>
        <p className="govuk-body govuk-!-margin-bottom-1 govuk-!-font-size-16"><strong>Ends</strong> <ShortDate value={windowEnd.toJSDate()} /></p>
      </div>
    );
  }

  // if before period end + 30 then display InPeriod Info
  if (days >= 0) {
    return (
      <div style={{ textAlign: "center" }}>
        <p className="govuk-heading-m govuk-!-margin-bottom-2">{days + 1}</p>
        <p className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16">days left of claim period</p>
        <p className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16">deadline <ShortDate value={windowEnd.toJSDate()} /></p>
      </div>
    );
  }

  // if after period end + 30 then display Overdue Info
  return (
    <div style={{ textAlign: "center" }}>
      <p className="govuk-heading-m govuk-!-margin-bottom-2" style={{ color: "#b10e1e" }}>{(days * -1)}</p>
      <p className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16" style={{ color: "#b10e1e" }}>days past claim period</p>
      <p className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16" style={{ color: "#b10e1e" }}>deadline <ShortDate value={windowEnd.toJSDate()} /></p>
    </div>
  );
};
