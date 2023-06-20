import { PCRItemForPeriodLengthChangeDto } from "@framework/dtos/pcrDtos";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { PeriodLengthChangeSummary } from "@ui/containers/pcrs/periodLengthChange/periodLengthChangeSummary";
import { PCRPeriodLengthChangeItemDtoValidator } from "@ui/validators/pcrDtoValidator";

export const periodLengthChangeWorkflow: IPCRWorkflow<
  PCRItemForPeriodLengthChangeDto,
  PCRPeriodLengthChangeItemDtoValidator
> = {
  steps: [],
  summary: {
    validation: val => val,
    summaryRender: PeriodLengthChangeSummary,
  },
};
