import { PCRItemForPeriodLengthChangeDto } from "@framework/dtos/pcrDtos";
import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { PeriodLengthChangeSummary } from "@ui/containers/pages/pcrs/periodLengthChange/periodLengthChangeSummary";
import { PCRPeriodLengthChangeItemDtoValidator } from "@ui/validation/validators/pcrDtoValidator";

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
