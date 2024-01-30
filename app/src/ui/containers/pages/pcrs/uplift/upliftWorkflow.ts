import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { PCRUpliftDtoValidator } from "@ui/validation/validators/pcrDtoValidator";
import { PCRItemForUpliftDto } from "@framework/dtos/pcrDtos";
import { UpliftSummary } from "./UpliftSummary";

const upliftWorkflow: IPCRWorkflow<PCRItemForUpliftDto, PCRUpliftDtoValidator> = {
  steps: [],
  migratedSummary: {
    migratedSummaryRender: UpliftSummary,
  },
  isMigratedToGql: true,
};

export { upliftWorkflow };
