import React from "react";
import { DateTime } from "luxon";

import { useContent } from "@ui/hooks";
import { ShortDate } from "../renderers/date";

interface Props {
  periodEnd: Date;
}

export const ClaimWindow: React.FunctionComponent<Props> = (props) => {
  const localOpts = { locale: "en-GB", zone: "Europe/London" };
  const today = DateTime.local().setLocale(localOpts.locale).setZone(localOpts.zone).set({ hour: 0, minute: 0, second: 0 });
  const windowStart = DateTime.fromJSDate(props.periodEnd, localOpts).plus({ days: 1 }).set({ hour: 0, minute: 0, second: 0 });
  const windowEnd = windowStart.plus({ days: 29 });
  const days = Math.round(windowEnd.diff(today, "days").days);

  const {getContent} = useContent();
  const nextClaimHeading = getContent(x => x.components.claimWindow.nextClaimPeriod);
  const beginsHeading = getContent(x => x.components.claimWindow.begins);
  const endHeading = getContent(x => x.components.claimWindow.end);
  const outstandingHeading = getContent(x => x.components.claimWindow.daysOutstanding);
  const deadline = getContent(x => x.components.claimWindow.deadline);
  const overdueHeading = getContent(x => x.components.claimWindow.daysOverdue);

  if(!windowStart.isValid) return null;

  // if before period end date then display UpcomingPeriodInfo
  if (today < windowStart) {
    return (
      <div style={{ textAlign: "center" }}>
        <p className="govuk-heading-s govuk-!-margin-bottom-2" data-qa="claim-window-heading">{nextClaimHeading}</p>
        <p className="govuk-body govuk-!-margin-bottom-1 govuk-!-font-size-16" data-qa="claim-begins"><strong>{beginsHeading}</strong> <ShortDate value={windowStart.toJSDate()} /></p>
        <p className="govuk-body govuk-!-margin-bottom-1 govuk-!-font-size-16" data-qa="claim-end"><strong>{endHeading}</strong> <ShortDate value={windowEnd.toJSDate()} /></p>
      </div>
    );
  }

  // if before period end + 30 then display InPeriod Info
  if (days >= 0) {
    return (
      <div style={{ textAlign: "center" }}>
        <p className="govuk-heading-m govuk-!-margin-bottom-2" data-qa="number-of-days">{days + 1}</p>
        <p className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16" data-qa="claim-daysLeft">{outstandingHeading}</p>
        <p className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16" data-qa="claim-inPeriod-deadline">{deadline} <ShortDate value={windowEnd.toJSDate()} /></p>
      </div>
    );
  }

  // if after period end + 30 then display Overdue Info
  return (
    <div style={{ textAlign: "center" }}>
      <p className="govuk-heading-m govuk-!-margin-bottom-2" data-qa="days-overdue" style={{ color: "#b10e1e" }}>{(days * -1)}</p>
      <p className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16" data-qa="claim-daysPast" style={{ color: "#b10e1e" }}>{overdueHeading}</p>
      <p className="govuk-heading-s govuk-!-margin-bottom-1 govuk-!-font-size-16" data-qa="claim-overdue-deadline" style={{ color: "#b10e1e" }}>{deadline} <ShortDate value={windowEnd.toJSDate()} /></p>
    </div>
  );
};
