import * as ACC from "@ui/components";
import { PcrSummaryProps } from "@ui/containers/pcrs/pcrWorkflow";
import { PCRItemForPeriodLengthChangeDto } from "@framework/dtos";
import { PCRPeriodLengthChangeItemDtoValidator } from "@ui/validators";
import { ClaimFrequency } from "@framework/constants";

export const PeriodLengthChangeSummary = (
  props: PcrSummaryProps<PCRItemForPeriodLengthChangeDto, PCRPeriodLengthChangeItemDtoValidator, "">,
) => {
  const monthlyContent = <ACC.Content value={x => x.pages.pcrPeriodLengthChange.periodLengthMonthly} />;
  const quarterlyContent = <ACC.Content value={x => x.pages.pcrPeriodLengthChange.periodLengthQuarterly} />;
  return (
    /* TODO: look at title sizing*/
    <ACC.Section title="">
      <ACC.Section qa="guidance">
        <ACC.Content markdown value={x => x.pages.pcrPeriodLengthChange.guidance} />
      </ACC.Section>
      <ACC.ReadonlyLabel qa="current-length" labelContent={x => x.pcrPeriodLengthChangeLabels.currentPeriodLength}>
        <ACC.Renderers.SimpleString qa="current-length">
          {props.project.claimFrequency === ClaimFrequency.Monthly ? monthlyContent : quarterlyContent}
        </ACC.Renderers.SimpleString>
      </ACC.ReadonlyLabel>
      <ACC.ReadonlyLabel qa="new-length" labelContent={x => x.pcrPeriodLengthChangeLabels.newPeriodLength}>
        <ACC.Renderers.SimpleString qa="new-length">
          {props.project.claimFrequency === ClaimFrequency.Monthly ? quarterlyContent : monthlyContent}
        </ACC.Renderers.SimpleString>
      </ACC.ReadonlyLabel>
    </ACC.Section>
  );
};
