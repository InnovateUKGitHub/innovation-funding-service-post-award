import { ProjectChangeRequestTypeSelector, ProjectTypeSelector } from "@gql/selectors/types";
import { PCRDashboardQuery$data } from "./__generated__/PCRDashboardQuery.graphql";

type Project = ProjectTypeSelector<PCRDashboardQuery$data>;
type ProjectChangeRequest = ProjectChangeRequestTypeSelector<Project>;

const collateProjectChangeRequests = (pcrs: { node: ProjectChangeRequest }[]) => {
  const collatedPcrs: {
    head: UnwrapArray<typeof pcrs>;
    children: typeof pcrs;
    archived: boolean;
  }[] = [];

  for (const pcr of pcrs) {
    if (pcr.node.RecordType?.Name?.value === "Request Header") {
      const childPcrs: typeof pcrs = [];

      for (const subPcr of pcrs) {
        if (pcr.node.Id === subPcr.node.Acc_RequestHeader__c?.value) {
          childPcrs.push(subPcr);
        }
      }

      collatedPcrs.push({
        head: pcr,
        children: childPcrs,
        archived:
          pcr.node.Acc_Status__c?.value === "Approved" ||
          pcr.node.Acc_Status__c?.value === "Withdrawn" ||
          pcr.node.Acc_Status__c?.value === "Rejected" ||
          pcr.node.Acc_Status__c?.value === "Actioned",
      });
    }
  }

  return collatedPcrs;
};

export { collateProjectChangeRequests };
export type { Project, ProjectChangeRequest };
