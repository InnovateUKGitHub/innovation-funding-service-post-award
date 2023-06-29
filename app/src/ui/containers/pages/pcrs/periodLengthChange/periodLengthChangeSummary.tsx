import { ClaimFrequency } from "@framework/constants/enums";
import { PCRStepId } from "@framework/constants/pcrConstants";
import { PCRItemForPeriodLengthChangeDto } from "@framework/dtos/pcrDtos";
import { Content } from "@ui/components/atomicDesign/molecules/Content/content";
import { ReadonlyLabel } from "@ui/components/atomicDesign/atoms/ReadOnlyLabel/readonlyLabel";
import { Section } from "@ui/components/atomicDesign/molecules/Section/section";
import { SimpleString } from "@ui/components/atomicDesign/atoms/SimpleString/simpleString";
import { PCRPeriodLengthChangeItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { PcrSummaryProps } from "../pcrWorkflow";

export const PeriodLengthChangeSummary = (
  props: PcrSummaryProps<PCRItemForPeriodLengthChangeDto, PCRPeriodLengthChangeItemDtoValidator, PCRStepId.none>,
) => {
  const monthlyContent = <Content value={x => x.pages.pcrPeriodLengthChange.periodLengthMonthly} />;
  const quarterlyContent = <Content value={x => x.pages.pcrPeriodLengthChange.periodLengthQuarterly} />;
  return (
    /* TODO: look at title sizing*/
    <Section title="">
      <Section qa="guidance">
        <Content markdown value={x => x.pages.pcrPeriodLengthChange.guidance} />
      </Section>
      <ReadonlyLabel qa="current-length" labelContent={x => x.pcrPeriodLengthChangeLabels.currentPeriodLength}>
        <SimpleString qa="current-length">
          {props.project.claimFrequency === ClaimFrequency.Monthly ? monthlyContent : quarterlyContent}
        </SimpleString>
      </ReadonlyLabel>
      <ReadonlyLabel qa="new-length" labelContent={x => x.pcrPeriodLengthChangeLabels.newPeriodLength}>
        <SimpleString qa="new-length">
          {props.project.claimFrequency === ClaimFrequency.Monthly ? quarterlyContent : monthlyContent}
        </SimpleString>
      </ReadonlyLabel>
    </Section>
  );
};
