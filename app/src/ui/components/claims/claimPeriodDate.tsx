import React from "react";
import {ClaimDto, PartnerDto} from "@framework/types";
import { ShortDateRange } from "../renderers/date";
import { PartnerName } from "@ui/components";

interface Props {
  claim: ClaimDto | null;
  partner?: PartnerDto | null;
}

export const ClaimPeriodDate: React.FunctionComponent<Props> = (props) => {
  if (!props.claim) return null;

  if (!props.partner) {
    return (
      <React.Fragment>
        Period {props.claim.periodId}: <ShortDateRange start={props.claim.periodStartDate} end={props.claim.periodEndDate} />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <PartnerName partner={props.partner}/> claim for period {props.claim.periodId}: <ShortDateRange start={props.claim.periodStartDate} end={props.claim.periodEndDate} />
    </React.Fragment>
  );
};
