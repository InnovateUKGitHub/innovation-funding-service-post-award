import { useContent } from "@ui/hooks/content.hook";
import { ShortDateRange } from "../../atoms/Date";

interface Props {
  periodId: number;
  periodStartDate: Date | null;
  periodEndDate: Date | null;
}

export const PeriodTitle: React.FunctionComponent<Props> = (props: Props) => {
  const { getContent } = useContent();

  return (
    <>
      {getContent(x => x.projectMessages.shortCurrentPeriodInfo({ currentPeriod: props.periodId }))}
      {": "}
      <ShortDateRange start={props.periodStartDate} end={props.periodEndDate} />
    </>
  );
};
