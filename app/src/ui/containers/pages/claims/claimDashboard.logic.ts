import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { claimDashboardQuery } from "./ClaimDashboard.query";
import { ClaimDashboardQuery } from "./__generated__/ClaimDashboardQuery.graphql";
import { mapToProfilePeriodDetailsDtoArray } from "@gql/dtoMapper/mapProfilePeriodDetail";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { mapToClaimDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { head } from "lodash";

export const useClaimDashboardData = (projectId: ProjectId, partnerId: PartnerId) => {
  const data = useLazyLoadQuery<ClaimDashboardQuery>(
    claimDashboardQuery,
    { projectId, projectIdStr: projectId, partnerId },
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

    const partner = head(
      mapToPartnerDtoArray(
        projectNode?.Acc_ProjectParticipantsProject__r?.edges ?? [],
        ["isLead", "roles", "isWithdrawn", "partnerStatus", "overdueProject", "name", "accountId", "id"],
        { partnerRoles: project.partnerRoles },
      ),
    );

    if (!partner) {
      throw new Error("could not find matching partner");
    }

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
        "isFinalClaim",
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

    const previousClaims = claims.filter(x => x.isApproved);
    const currentClaim = claims.find(x => !x.isApproved) ?? null;

    return { project, partner, previousClaims, currentClaim };
  }, []);
};
