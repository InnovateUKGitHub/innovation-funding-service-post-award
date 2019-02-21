import React from "react";
import * as ACC from "..";
import {ClaimDto, PartnerDto} from "../../../types";

interface Props {
  claim: ClaimDto | null;
  partner?: PartnerDto | null;
}

export const ClaimPeriodDate: React.SFC<Props> = (props) => {
  if (!props.claim) return null;

  if (!props.partner) {
    return (
      <React.Fragment>
        Period {props.claim.periodId}: <ACC.Renderers.LongDateRange start={props.claim.periodStartDate} end={props.claim.periodEndDate} isShortMonth={true} />
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      {props.partner.name} claim for period {props.claim.periodId}: <ACC.Renderers.LongDateRange start={props.claim.periodStartDate} end={props.claim.periodEndDate} isShortMonth={true}/>
    </React.Fragment>
  );
};
