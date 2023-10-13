import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { claimPrepareQuery } from "./ClaimPrepare.query";
import { ClaimPrepareQuery } from "./__generated__/ClaimPrepareQuery.graphql";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getPartnerRoles, mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToClaimDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { Claims } from "@framework/constants/recordTypes";

export const useClaimPreparePageData = (projectId: ProjectId, partnerId: PartnerId, periodId: PeriodId) => {
  const data = useLazyLoadQuery<ClaimPrepareQuery>(
    claimPrepareQuery,
    { projectId, projectIdStr: projectId, partnerId, periodId },
    { fetchPolicy: "network-only" },
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges);
  const claimsGql = data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [];

  return useMemo(() => {
    const project = mapToProjectDto(projectNode, ["roles", "partnerRoles", "id", "competitionType"]);

    const partner = mapToPartnerDto(partnerNode, ["roles", "isWithdrawn", "partnerStatus"], {
      roles: getPartnerRoles(project.partnerRoles, partnerNode?.Id ?? "unknown"),
    });

    const claims = mapToClaimDtoArray(
      claimsGql.filter(x => x?.node?.RecordType?.DeveloperName?.value === Claims.totalProjectPeriod),
      ["isFinalClaim", "status", "periodId"],
      {},
    );

    const claim = claims.find(claim => claim.periodId === periodId);

    if (!claim) throw new Error(" there is no matching claim");

    return {
      project,
      partner,
      claim,
      fragmentRef: data?.salesforce?.uiapi,
    };
  }, []);
};
