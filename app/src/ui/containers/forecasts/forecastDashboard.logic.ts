import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { forecastDashboardQuery } from "./ForecastDashboard.query";
import { ForecastDashboardQuery, ForecastDashboardQuery$data } from "./__generated__/ForecastDashboardQuery.graphql";
import { mapToPartnerDtoArray, mapToProjectDto } from "@gql/dtoMapper";
import { PartnerDtoGql } from "@framework/dtos";
import { sortPartnersLeadFirst } from "@framework/util/partnerHelper";

export type Partner = Pick<
  PartnerDtoGql,
  "id" | "name" | "isLead" | "isWithdrawn" | "forecastLastModifiedDate" | "forecastsAndCosts" | "totalParticipantGrant"
>;

type ProjectGQL = GQL.NodeSelector<ForecastDashboardQuery$data, "Acc_Project__c">;

export const useForecastDashboardData = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<ForecastDashboardQuery>(forecastDashboardQuery, { projectId });
  const { node: projectNode } = getFirstEdge<ProjectGQL>(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  return useMemo(() => {
    const project = mapToProjectDto(projectNode, ["id", "title", "projectNumber", "roles", "status"]);

    const partners = mapToPartnerDtoArray(
      projectNode?.Acc_ProjectParticipantsProject__r?.edges ?? [],
      ["id", "name", "isLead", "isWithdrawn", "forecastLastModifiedDate", "totalParticipantGrant", "forecastsAndCosts"],
      {},
    );

    return { project, partners: sortPartnersLeadFirst(partners) };
  }, []);
};
