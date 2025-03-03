import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { useNavigate } from "react-router-dom";
import { ChangeRemainingGrantSchemaType } from "./changeRemainingGrant.zod";
import { z } from "zod";
import { useMessageContext } from "@ui/context/messages";
import { useFetchKey } from "@ui/context/FetchKeyProvider";
import { useLazyLoadQuery } from "react-relay";
import { ChangeRemainingGrantQuery } from "./__generated__/ChangeRemainingGrantQuery.graphql";
import { changeRemainingGrantQuery } from "./ChangeRemainingGrant.query";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { mapToFinancialVirementForParticipantDtoArray } from "@gql/dtoMapper/mapFinancialVirementForParticipant";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { roundCurrency } from "@framework/util/numberHelper";
import { mapToFinancialVirementForCostsDtoArray } from "@gql/dtoMapper/mapFinancialVirementForCosts";
import { sumBy } from "lodash";
import { partnerSorterAlphabetical, partnerSorterLeadFirst } from "@framework/util/partnerHelper";

export const useChangeRemainingGrantData = ({
  projectId,
  pcrItemId,
  fetchKey,
}: {
  projectId: ProjectId;
  pcrItemId: PcrItemId;
  fetchKey: number;
}) => {
  const data = useLazyLoadQuery<ChangeRemainingGrantQuery>(
    changeRemainingGrantQuery,
    { projectId, pcrItemId },
    { fetchPolicy: "network-only", fetchKey },
  );

  const project = mapToProjectDto(getFirstEdge(data.salesforce.uiapi.query.Acc_Project__c?.edges).node, [
    "isNonFec",
    "roles",
    "competitionType",
  ]);

  const partners = mapToPartnerDtoArray(
    data.salesforce.uiapi.query.Acc_ProjectParticipant__c?.edges ?? [],
    [
      "id",
      "name",
      "isLead",
      "totalRemainingCosts",
      "awardRate",
      "capLimitDeferredGrant",
      "remainingParticipantGrant",
      "totalApprovedCosts",
    ],
    {},
  );

  const financialVirementsForParticipants = mapToFinancialVirementForParticipantDtoArray(
    data.salesforce.uiapi.query.Acc_VirementsForParticipant?.edges ?? [],
    ["id", "newEligibleCosts", "newFundingLevel", "partnerId"],
  );

  const financialVirementsForCosts = mapToFinancialVirementForCostsDtoArray(
    data.salesforce.uiapi.query.Acc_VirementsForCosts?.edges ?? [],
    ["id", "parentId", "newEligibleCosts"],
  );

  const partnerData = financialVirementsForParticipants
    .map(x => {
      const matchingCostData = financialVirementsForCosts.filter(y => y.parentId === x.id);
      const matchingPartner = partners.find(z => z.id === x.partnerId)!;
      const newRemainingCosts =
        sumBy(matchingCostData, v => v.newEligibleCosts) - (matchingPartner.totalApprovedCosts ?? 0);
      return {
        ...x,
        newRemainingGrant: roundCurrency(newRemainingCosts * ((matchingPartner.awardRate ?? 0) / 100)),
        originalRemainingCosts: matchingPartner.totalRemainingCosts ?? 0,
        name: matchingPartner.name,
        isLead: matchingPartner.isLead,
        originalRemainingGrant:
          (matchingPartner.remainingParticipantGrant ?? 0) - (matchingPartner.capLimitDeferredGrant ?? 0),
        newRemainingCosts,
        originalFundingLevel: matchingPartner.awardRate,
      };
    })
    .sort(partnerSorterAlphabetical)
    .sort(partnerSorterLeadFirst);

  const originalRemainingGrant = sumBy(partnerData, "originalRemainingGrant");
  const newRemainingGrant = sumBy(partnerData, "newRemainingGrant");
  const originalRemainingCosts = sumBy(partnerData, "originalRemainingCosts");
  const newRemainingCosts = sumBy(partnerData, "newRemainingCosts");
  const originalFundingLevel = roundCurrency(
    originalRemainingCosts ? (100 * originalRemainingGrant) / originalRemainingCosts : 0,
  );
  return {
    project,
    partnerData,
    originalRemainingGrant,
    newRemainingGrant,
    originalRemainingCosts,
    newRemainingCosts,
    originalFundingLevel,
    fragmentRef: data.salesforce.uiapi,
  };
};

export const useOnUpdateChangeRemainingGrant = (
  projectId: ProjectId,
  pcrId: PcrId,
  pcrItemId: PcrItemId,
  navigateTo: string,
) => {
  const navigate = useNavigate();
  const { clearMessages } = useMessageContext();
  const [, setFetchKey] = useFetchKey();

  return useOnUpdate({
    req: (data: z.output<ChangeRemainingGrantSchemaType>) =>
      clientsideApiClient.pcrs.changeRemainingGrant({
        projectId,
        pcrId,
        pcrItemId,
        pcr: data,
      }),
    onSuccess: () => {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(navigateTo);
    },
  });
};

export const getNewFundingLevel = (newRemainingCosts: number, newRemainingGrant: number, newFundingLevel: number) => {
  if (!newRemainingCosts) {
    return newFundingLevel;
  }
  return (newRemainingGrant / newRemainingCosts) * 100;
};
