import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { z } from "zod";
import { claimReviewSchema } from "./claimReview.zod";
import { claimReviewQuery } from "./ClaimReview.query";
import { ClaimReviewQuery } from "./__generated__/ClaimReviewQuery.graphql";
import { RefreshedQueryOptions } from "@gql/hooks/useRefreshQuery";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapToClaimDtoArray } from "@gql/dtoMapper/mapClaimDto";
import { useNavigate } from "react-router-dom";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { ClaimDto } from "@framework/dtos/claimDto";
import { useContent } from "@ui/hooks/content.hook";
import { head } from "lodash";

type QueryOptions = RefreshedQueryOptions | { fetchPolicy: "network-only" };

export const useClaimReviewPageData = (
  projectId: ProjectId,
  partnerId: PartnerId,
  periodId: PeriodId,
  queryOptions: QueryOptions = { fetchPolicy: "network-only" },
) => {
  const data = useLazyLoadQuery<ClaimReviewQuery>(
    claimReviewQuery,
    { projectId, projectIdStr: projectId, partnerId, periodId },
    queryOptions,
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["competitionName", "competitionType", "id", "roles"]);

  const claim = head(mapToClaimDtoArray(data?.salesforce?.uiapi?.query?.Claims?.edges ?? [], ["isFinalClaim"], {}));

  if (!claim) throw new Error(" there is no matching claim");

  return {
    project,
    claim,
    fragmentRef: data?.salesforce?.uiapi,
    currentUser: data?.currentUser,
  };
};

export const useOnUpdateClaimReview = (
  partnerId: PartnerId,
  projectId: ProjectId,
  periodId: PeriodId,
  navigateTo: string,
  claim: PickRequiredFromPartial<ClaimDto, "id" | "partnerId">,
) => {
  const navigate = useNavigate();
  return useOnUpdate<z.output<typeof claimReviewSchema>, Pick<ClaimDto, "status" | "comments" | "partnerId">>({
    req(data) {
      return clientsideApiClient.claims.update({
        partnerId,
        projectId,
        periodId,
        claim: { ...claim, ...data } as ClaimDto,
      });
    },
    onSuccess() {
      navigate(navigateTo);
    },
  });
};

/**
 *
 * @returns content for the review claims page
 */
export function useReviewContent() {
  const { getContent } = useContent();

  return {
    accordionTitleClaimLog: getContent(x => x.claimsLabels.accordionTitleClaimLog),
    accordionTitleForecast: getContent(x => x.claimsLabels.accordionTitleForecast),
    accordionTitleSupportingDocumentsForm: getContent(x => x.pages.claimReview.accordionTitleSupportingDocumentsForm),
    additionalInfo: getContent(x => x.pages.claimReview.additionalInfo),
    additionalInfoHint: getContent(x => x.pages.claimReview.additionalInfoHint),
    backLink: getContent(x => x.pages.claimReview.backLink),
    buttonSendQuery: getContent(x => x.pages.claimReview.buttonSendQuery),
    buttonSubmit: getContent(x => x.pages.claimReview.buttonSubmit),
    buttonUpload: getContent(x => x.pages.claimReview.buttonUpload),
    claimReviewDeclaration: getContent(x => x.pages.claimReview.claimReviewDeclaration),
    competitionName: getContent(x => x.projectLabels.competitionName),
    competitionType: getContent(x => x.projectLabels.competitionType),
    descriptionLabel: getContent(x => x.pages.claimDocuments.descriptionLabel),
    finalClaim: getContent(x => x.claimsMessages.finalClaim),
    labelInputUpload: getContent(x => x.pages.claimReview.labelInputUpload),
    monitoringReportReminder: getContent(x => x.pages.claimReview.monitoringReportReminder),
    noDocumentsUploaded: getContent(x => x.documentMessages.noDocumentsUploaded),
    noMatchingDocumentsMessage: getContent(x => x.pages.projectDocuments.noMatchingDocumentsMessage),
    optionQueryClaim: getContent(x => x.pages.claimReview.optionQueryClaim),
    optionSubmitClaim: getContent(x => x.pages.claimReview.optionSubmitClaim),
    searchDocumentsMessage: getContent(x => x.pages.projectDocuments.searchDocumentsMessage),
    sectionTitleAdditionalInfo: getContent(x => x.pages.claimReview.sectionTitleAdditionalInfo),
    sectionTitleHowToProceed: getContent(x => x.pages.claimReview.sectionTitleHowToProceed),
    uploadInstruction: getContent(x => x.documentMessages.uploadInstruction),
  };
}
