import React from "react";
import * as ACC from "..";
import { ClaimDto } from "../../../types";

interface Props {
  claim: ClaimDto | null;
}

export const ClaimPeriodDate: React.SFC<Props> = (props) => !props.claim ? null : (
  <React.Fragment>
    Period {props.claim.periodId}: <ACC.Renderers.LongDateRange start={props.claim.periodStartDate} end={props.claim.periodEndDate} isShortMonth={true} />
  </React.Fragment>
);
