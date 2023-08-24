import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { claimDetailsQuery } from "./ClaimDetails.query";
import { ClaimDetailsQuery } from "./__generated__/ClaimDetailsQuery.graphql";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToClaimDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { head } from "lodash";

export const useClaimDetailsPageData = (projectId: ProjectId, partnerId: PartnerId, periodId: PeriodId) => {
  const data = useLazyLoadQuery<ClaimDetailsQuery>(
    claimDetailsQuery,
    { projectId, projectIdStr: projectId, partnerId, periodId },
    { fetchPolicy: "network-only" },
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges);

  const project = mapToProjectDto(projectNode, ["competitionType", "id", "partnerRoles", "roles"]);

  const partner = mapToPartnerDto(partnerNode, ["id", "partnerStatus", "isWithdrawn", "roles"], {
    roles: project.partnerRoles.find(x => x.partnerId === partnerNode?.Acc_AccountId__c?.value) ?? {
      isFc: false,
      isMo: false,
      isPm: false,
    },
  });

  const claim = head(
    mapToClaimDtoArray(
      data?.salesforce?.uiapi?.query?.Claims?.edges ?? [],
      [
        "comments",
        "isApproved",
        "isFinalClaim",
        "periodCostsToBePaid",
        "status",
        "totalCostsApproved",
        "totalCostsSubmitted",
        "totalDeferredAmount",
      ],
      {},
    ),
  );

  if (!claim) throw new Error(" there is no matching claim");

  return {
    project,
    partner,
    claim,
    email: data?.currentUser?.userId ?? "unknown-id",
    fragmentRef: data?.salesforce?.uiapi,
  };
};
