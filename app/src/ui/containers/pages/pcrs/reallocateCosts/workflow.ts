import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { FinancialVirementSummary } from "./summary/ReallocateCostsSummary";

export const financialVirementWorkflow: IPCRWorkflow = {
  steps: [],
  summary: {
    summaryRender: FinancialVirementSummary,
  },
};
