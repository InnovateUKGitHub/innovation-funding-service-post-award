import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { claimDetailsQuery } from "./ClaimDetails.query";
import { ClaimDetailsQuery } from "./__generated__/ClaimDetailsQuery.graphql";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToPartnerDto } from "@gql/dtoMapper/mapPartnerDto";
import { mapToClaimDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { DocumentSummaryNode, mapToProjectDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";
import { Claims } from "@framework/constants/recordTypes";

export const useClaimDetailsPageData = (projectId: ProjectId, partnerId: PartnerId, periodId: PeriodId) => {
  const data = useLazyLoadQuery<ClaimDetailsQuery>(
    claimDetailsQuery,
    { projectId, projectIdStr: projectId, partnerId, periodId },
    { fetchPolicy: "network-only" },
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: partnerNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges);
  const claimsGql = data?.salesforce?.uiapi?.query?.Acc_Claims__c?.edges ?? [];

  return useMemo(() => {
    const project = mapToProjectDto(projectNode, ["id", "partnerRoles", "roles"]);

    const partner = mapToPartnerDto(partnerNode, ["id", "partnerStatus", "isWithdrawn", "roles"], {
      roles: project.partnerRoles.find(x => x.partnerId === partnerNode?.Id) ?? {
        isFc: false,
        isMo: false,
        isPm: false,
      },
    });

    // CLAIMS
    const claims = mapToClaimDtoArray(
      claimsGql.filter(x => x?.node?.RecordType?.DeveloperName?.value === Claims.totalProjectPeriod),
      [
        "comments",
        "isApproved",
        "isFinalClaim",
        "status",
        "totalCostsSubmitted",
        "totalCostsApproved",
        "totalDeferredAmount",
        "periodCostsToBePaid",
        "periodId",
      ],
      {},
    );

    const documentsGql = data?.salesforce?.uiapi?.query?.ClaimsByPeriodForDocuments?.edges ?? [];

    const documents = documentsGql
      .map(docs =>
        mapToProjectDocumentSummaryDtoArray(
          docs?.node?.ContentDocumentLinks?.edges ?? ([] as DocumentSummaryNode[]),
          ["id", "dateCreated", "fileSize", "fileName", "link", "uploadedBy", "isOwner", "description"],
          {
            projectId,
            currentUser: { userId: data.currentUser.userId },
            type: docs?.node?.RecordType?.DeveloperName?.value === Claims.claimsDetail ? "claim details" : "claims",
            partnerId,
            periodId,
            costCategoryId: docs?.node?.Acc_CostCategory__c?.value ?? "",
          },
        ),
      )
      .flat();

    const claim = claims.find(claim => claim.periodId === periodId);

    if (!claim) throw new Error(" there is no matching claim");

    return {
      project,
      partner,
      claim,
      documents,
      fragmentRef: data?.salesforce?.uiapi,
    };
  }, []);
};
