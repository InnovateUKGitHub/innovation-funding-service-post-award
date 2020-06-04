import { PCRItemForPeriodLengthChangeDto } from "@framework/dtos";
import { PCRPeriodLengthChangeItemDtoValidator } from "@ui/validators";
import { IPCRWorkflow } from "@ui/containers/pcrs/pcrWorkflow";
import { PeriodLengthChangeSummary } from "@ui/containers/pcrs/periodLengthChange/summary";

export const periodLengthChangeWorkflow: IPCRWorkflow<PCRItemForPeriodLengthChangeDto, PCRPeriodLengthChangeItemDtoValidator> = {
  steps: [],
  summary: {
    validation: val => val,
    summaryRender: PeriodLengthChangeSummary
  }
};
