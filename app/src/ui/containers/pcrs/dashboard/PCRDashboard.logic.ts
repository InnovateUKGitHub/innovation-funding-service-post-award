import { ProjectChangeRequestTypeSelector, ProjectTypeSelector } from "@gql/selectors/types";
import { PCRDashboardQuery, PCRDashboardQuery$data } from "./__generated__/PCRDashboardQuery.graphql";
import { useLazyLoadQuery } from "react-relay";
import { pcrDashboardQuery } from "./PCRDashboard.query";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper";
import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { useContent } from "@ui/hooks";
import { useMemo } from "react";

type Project = ProjectTypeSelector<PCRDashboardQuery$data>;
type ProjectChangeRequest = ProjectChangeRequestTypeSelector<Project>;

export const useGetPcrTypeName = () => {
  const { getContent } = useContent();
  return useMemo(
    () => (value?: string) => {
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
          return getContent(x => x.pcrTypes.partnerWithdrawal);
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
    },
    [],
  );
};

type ProjectGQL = GQL.NodeSelector<PCRDashboardQuery$data, "Acc_Project__c">;

export const usePcrDashboardQuery = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<PCRDashboardQuery>(
    pcrDashboardQuery,
    {
      projectId,
    },
    {
      fetchPolicy: "network-only",
      networkCacheConfig: {
        force: true,
      },
    },
  );

  const { node: projectNode } = getFirstEdge<ProjectGQL>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["id", "projectNumber", "roles", "title", "status"]);

  const pcrs = mapToPcrDtoArray(
    projectNode?.Project_Change_Requests__r?.edges ?? [],
    ["status", "statusName", "started", "lastUpdated", "id", "projectId", "requestNumber"],
    ["shortName"],
  );

  return {
    project,
    pcrs,
  };
};
export type { Project, ProjectChangeRequest };
