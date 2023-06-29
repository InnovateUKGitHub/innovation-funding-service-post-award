import { ShortDateRange } from "../../atoms/Date";

interface Props {
  periodId: number;
  periodStartDate: Date | null;
  periodEndDate: Date | null;
}

export const PeriodTitle: React.FunctionComponent<Props> = (props: Props) => {
  return (
    <>
      Period {props.periodId}: <ShortDateRange start={props.periodStartDate} end={props.periodEndDate} />
    </>
  );
};
