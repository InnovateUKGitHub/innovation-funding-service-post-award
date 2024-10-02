import { IPCRWorkflow } from "@ui/pages/pcrs/pcrWorkflow";
import { ManageTeamMemberSummary } from "./summary/ManageTeamMemberSummary";

const manageTeamMemberWorkflow: IPCRWorkflow = {
  steps: [],
  summary: {
    summaryRender: ManageTeamMemberSummary,
  },
};

export { manageTeamMemberWorkflow };
