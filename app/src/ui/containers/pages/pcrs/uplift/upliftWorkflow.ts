import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { UpliftSummary } from "./UpliftSummary";

const upliftWorkflow: IPCRWorkflow = {
  steps: [],
  summary: {
    summaryRender: UpliftSummary,
  },
};

export { upliftWorkflow };
