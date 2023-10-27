import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { allClaimsDashboardQuery } from "./AllClaimsDashboard.query";
import { AllClaimsDashboardQuery } from "./__generated__/AllClaimsDashboardQuery.graphql";
import { sortPartnersLeadFirst } from "@framework/util/partnerHelper";
import { mapToProfilePeriodDetailsDtoArray } from "@gql/dtoMapper/mapProfilePeriodDetail";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { mapToClaimDtoArray } from "@gql/dtoMapper/mapClaimDto";

export const useAllClaimsDashboardData = (projectId: ProjectId) => {
  const data = useLazyLoadQuery<AllClaimsDashboardQuery>(
    allClaimsDashboardQuery,
    { projectId, projectIdStr: projectId },
    { fetchPolicy: "network-only" },
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const claimsGql = data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [];
  const profileGql = data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? [];

  return useMemo(() => {
    const project = mapToProjectDto(projectNode, [
      "competitionType",
      "isActive",
      "partnerRoles",
      "periodEndDate",
      "periodStartDate",
      "projectNumber",
      "roles",
      "status",
      "title",
      "id",
    ]);

    const partners = sortPartnersLeadFirst(
      mapToPartnerDtoArray(
        projectNode?.Acc_ProjectParticipantsProject__r?.edges ?? [],
        ["isLead", "roles", "isWithdrawn", "partnerStatus", "overdueProject", "name", "accountId", "id"],
        { partnerRoles: project.partnerRoles },
      ),
    );

    const periodProfileDetails = mapToProfilePeriodDetailsDtoArray(profileGql, [
      "partnerId",
      "forecastCost",
      "periodId",
    ]);

    const claims = mapToClaimDtoArray(
      claimsGql,
      [
        "approvedDate",
        "forecastCost",
        "isApproved",
        "lastModifiedDate",
        "paidDate",
        "partnerId",
        "periodEndDate",
        "periodId",
        "periodStartDate",
        "status",
        "statusLabel",
        "totalCost",
      ],
      { periodProfileDetails, competitionType: project.competitionType },
    );

    return { project, partners, claims };
  }, []);
};
