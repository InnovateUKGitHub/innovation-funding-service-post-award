import { ILinkInfo } from "@framework/types";
import { createTypedTable } from "@ui/components/table";
import { Link } from "@ui/components/links";
import { LineBreakList, SimpleString } from "@ui/components/renderers";
import { BaseProps } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks";
import { collateProjectChangeRequests, Project } from "./PCRDashboard.logic";
import { usePcrItemName } from "../utils/getPcrItemName";

const PCRTable = createTypedTable<UnwrapArray<ReturnType<typeof collateProjectChangeRequests>>>();

const PCRDashboardTable = ({
  collated,
  project,
  routes,
  active,
  archived,
  qa,
}: {
  collated: ReturnType<typeof collateProjectChangeRequests>;
  project: Project;
  routes: BaseProps["routes"];
  active?: boolean;
  archived?: boolean;
  qa: string;
}) => {
  const { isPm, isMo } = project.roles;
  const { getContent } = useContent();
  const { getPcrItemName } = usePcrItemName();

  let filteredCollatedPCRs = collated;

  if (active) filteredCollatedPCRs = filteredCollatedPCRs.filter(x => !x.archived);
  if (archived) filteredCollatedPCRs = filteredCollatedPCRs.filter(x => x.archived);

  if (!filteredCollatedPCRs.length) {
    if (active) {
      return <SimpleString>{getContent(x => x.pages.pcrsDashboard.noOngoingRequests)}</SimpleString>;
    } else if (archived) {
      return <SimpleString>{getContent(x => x.pages.pcrsDashboard.noPastRequests)}</SimpleString>;
    }
  }

  return (
    <PCRTable.Table data={filteredCollatedPCRs} qa={qa}>
      <PCRTable.Custom
        qa="number"
        header={getContent(x => x.pcrLabels.requestNumber)}
        value={x => x.head.node.Acc_RequestNumber__c?.value}
      />
      <PCRTable.Custom
        qa="types"
        header={getContent(x => x.pcrLabels.types)}
        value={x => (
          <LineBreakList items={x.children.map(y => getPcrItemName(y.node.RecordType?.Name?.value ?? undefined))} />
        )}
      />
      <PCRTable.ShortDate
        qa="started"
        header={getContent(x => x.pcrLabels.started)}
        value={x => x.head.node.CreatedDate?.value}
      />
      <PCRTable.String
        qa="status"
        header={getContent(x => x.pcrLabels.status)}
        value={x => x.head.node.Acc_Status__c?.value ?? null}
      />
      <PCRTable.ShortDate
        qa="lastUpdated"
        header={getContent(x => x.pcrLabels.lastUpdated)}
        value={x => x.head.node.LastModifiedDate?.value}
      />
      <PCRTable.Custom
        qa="actions"
        header={getContent(x => x.pcrLabels.actions)}
        hideHeader
        value={x => {
          const links: { route: ILinkInfo; text: string; qa: string }[] = [];
          const pcrLinkArgs = { pcrId: x.head.node.Id, projectId: project.Id as ProjectId };

          if (
            (x.head.node.Acc_Status__c?.value === "Draft" ||
              x.head.node.Acc_Status__c?.value === "Queried by Monitoring Officer" ||
              x.head.node.Acc_Status__c?.value === "Queried by Innovate UK") &&
            isPm &&
            project.isActive
          ) {
            links.push({
              route: routes.pcrPrepare.getLink(pcrLinkArgs),
              text: getContent(x => x.pcrLabels.edit),
              qa: "pcrPrepareLink",
            });
          } else if (
            x.head.node.Acc_Status__c?.value === "Submitted to Monitoring Officer" &&
            isMo &&
            project.isActive
          ) {
            links.push({
              route: routes.pcrReview.getLink(pcrLinkArgs),
              text: getContent(x => x.pcrLabels.review),
              qa: "pcrReviewLink",
            });
          } else if (isPm || isMo) {
            links.push({
              route: routes.pcrDetails.getLink(pcrLinkArgs),
              text: getContent(x => x.pcrLabels.view),
              qa: "pcrViewLink",
            });
          }

          if (x.head.node.Acc_Status__c?.value === "Draft" && isPm && project.isActive) {
            links.push({
              route: routes.pcrDelete.getLink(pcrLinkArgs),
              text: getContent(x => x.pcrLabels.delete),
              qa: "pcrDeleteLink",
            });
          }

          return links.map((x, i) => (
            <div key={i} data-qa={x.qa}>
              <Link route={x.route}>{x.text}</Link>
            </div>
          ));
        }}
      />
    </PCRTable.Table>
  );
};

export { PCRDashboardTable };
