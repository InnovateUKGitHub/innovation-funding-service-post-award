import React from "react";
import { ShortDateRange } from "./renderers/date";

interface Props {
  periodId: number;
  periodStartDate: Date | null;
  periodEndDate: Date | null;
}

export const PeriodTitle: React.FunctionComponent<Props> = (props) => {
  return (
    <React.Fragment>
      Period {props.periodId}: <ShortDateRange start={props.periodStartDate} end={props.periodEndDate} />
    </React.Fragment>
  );
};
