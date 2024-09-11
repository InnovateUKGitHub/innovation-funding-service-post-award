import { IPCRWorkflow } from "@ui/containers/pages/pcrs/pcrWorkflow";
import { ManageTeamMemberSummary } from "./summary/ManageTeamMemberSummary";

const manageTeamMemberWorkflow: IPCRWorkflow = {
  steps: [],
  summary: {
    summaryRender: ManageTeamMemberSummary,
  },
};

export { manageTeamMemberWorkflow };
