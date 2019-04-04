import React from "react";
import * as Renderers from "./renderers";

interface Props {
  periodId: number;
  periodStartDate: Date;
  periodEndDate: Date;
}

export const PeriodTitle: React.SFC<Props> = (props) => {
  return (
    <React.Fragment>
      Period {props.periodId}: <Renderers.ShortDateRange start={props.periodStartDate} end={props.periodEndDate} />
    </React.Fragment>
  );
};
