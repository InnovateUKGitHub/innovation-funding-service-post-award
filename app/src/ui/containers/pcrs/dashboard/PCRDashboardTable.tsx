import { ILinkInfo } from "@framework/types";
import { createTypedTable } from "@ui/components/table";
import { Link } from "@ui/components/links";
import { LineBreakList, SimpleString } from "@ui/components/renderers";
import { BaseProps } from "@ui/containers/containerBase";
import { useContent } from "@ui/hooks";
import { collateProjectChangeRequests, Project } from "./PCRDashboard.logic";

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

  /**
   * Convert a Salesforce PCR name to an internationalised PCR name.
   *
   * @param value The Salesforce name of the PCR type
   */
  const getPcrTypeName = (value?: string) => {
    switch (value) {
      case "Account Name Change":
        return getContent(x => x.pcrTypes.accountNameChange);
      case "Add a partner":
        return getContent(x => x.pcrTypes.addAPartner);
      case "Between Partner Financial Virement":
        return getContent(x => x.pcrTypes.betweenPartnerFinancialVirement);
      case "Change a partner's name":
        return getContent(x => x.pcrTypes.changeAPartnersName);
      case "Change Loans Duration":
        return getContent(x => x.pcrTypes.changeLoansDuration);
      case "Change period length":
        return getContent(x => x.pcrTypes.changePeriodLength);
      case "Change project duration":
        return getContent(x => x.pcrTypes.changeProjectDuration);
      case "Change project scope":
        return getContent(x => x.pcrTypes.changeProjectScope);
      case "End the project early":
        return getContent(x => x.pcrTypes.endTheProjectEarly);
      case "Financial Virement":
        return getContent(x => x.pcrTypes.financialVirement);
      case "Loan Drawdown Change":
        return getContent(x => x.pcrTypes.loanDrawdownChange);
      case "Multiple Partner Financial Virement":
        return getContent(x => x.pcrTypes.multiplePartnerFinancialVirement);
      case "Partner Addition":
        return getContent(x => x.pcrTypes.partnerAddition);
      case "Partner Withdrawal":
        return getContent(x => x.pcrTypes.partnerWithdrawl);
      case "Project Suspension":
        return getContent(x => x.pcrTypes.projectSuspension);
      case "Project Termination":
        return getContent(x => x.pcrTypes.projectTermination);
      case "Put project on hold":
        return getContent(x => x.pcrTypes.putProjectOnHold);
      case "Reallocate one partner's project costs":
        return getContent(x => x.pcrTypes.reallocateOnePartnersProjectCost);
      case "Reallocate several partners' project cost":
        return getContent(x => x.pcrTypes.reallocateSeveralPartnersProjectCost);
      case "Remove a partner":
        return getContent(x => x.pcrTypes.removeAPartner);
      case "Request Header":
        return getContent(x => x.pcrTypes.requestHeader);
      case "Scope Change":
        return getContent(x => x.pcrTypes.scopeChange);
      case "Single Partner Financial Virement":
        return getContent(x => x.pcrTypes.singlePartnerFinancialVirement);
      case "Time Extension":
        return getContent(x => x.pcrTypes.timeExtension);
      default:
        return getContent(x => x.pcrTypes.unknown);
    }
  };

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
          <LineBreakList items={x.children.map(y => getPcrTypeName(y.node.RecordType?.Name?.value ?? undefined))} />
        )}
      />
      <PCRTable.ShortDate
        qa="started"
        header={getContent(x => x.pcrLabels.started)}
        value={x => x.head.node.CreatedDate?.value}
      />
      <PCRTable.String
        qa="stauts"
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
          const pcrLinkArgs = { pcrId: x.head.node.Id, projectId: project.Id };

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
