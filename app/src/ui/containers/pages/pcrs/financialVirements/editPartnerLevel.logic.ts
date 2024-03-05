import { useLazyLoadQuery } from "react-relay";
import { pick, sumBy } from "lodash";
import { EditPartnerLevelQuery } from "./__generated__/EditPartnerLevelQuery.graphql";
import { editPartnerLevelQuery } from "./EditPartnerLevel.query";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { mapToClaimOverrides } from "@gql/dtoMapper/mapClaimOverrides";
import { mapToFinancialVirementForParticipantDtoArray } from "@gql/dtoMapper/mapFinancialVirementForParticipant";
import { mapToFinancialVirementForCostsDtoArray } from "@gql/dtoMapper/mapFinancialVirementForCosts";
import { useNavigate } from "react-router-dom";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { EditPartnerLevelSchema } from "./editPartnerLevel.zod";
import { useMapVirements } from "./mapFinancialVirements";
import { roundCurrency } from "@framework/util/numberHelper";

export const useEditPartnerLevelData = ({ projectId, itemId }: { projectId: ProjectId; itemId: PcrItemId }) => {
  const data = useLazyLoadQuery<EditPartnerLevelQuery>(
    editPartnerLevelQuery,
    { projectId, itemId },
    { fetchPolicy: "network-only" },
  );

  const project = mapToProjectDto(getFirstEdge(data.salesforce.uiapi.query.Acc_Project__c?.edges).node, [
    "title",
    "projectNumber",
    "isNonFec",
  ]);

  const partners = mapToPartnerDtoArray(
    data.salesforce.uiapi.query.Acc_ProjectParticipant__c?.edges ?? [],
    ["id", "name", "isLead"],
    {},
  );

  const pcrItem = mapPcrItemDto(
    getFirstEdge(data.salesforce.uiapi.query.Acc_ProjectChangeRequest__c?.edges).node,
    ["status", "grantMovingOverFinancialYear"],
    {},
  );

  const claimOverrides = mapToClaimOverrides(data?.salesforce?.uiapi?.query?.Acc_Profile__c?.edges ?? []);

  const financialVirementsForParticipants = mapToFinancialVirementForParticipantDtoArray(
    data.salesforce.uiapi.query.Acc_VirementsForParticipant?.edges ?? [],
    ["id", "newEligibleCosts", "newFundingLevel", "newRemainingGrant", "originalFundingLevel", "partnerId"],
  );

  const financialVirementsForCosts = mapToFinancialVirementForCostsDtoArray(
    data.salesforce.uiapi.query.Acc_VirementsForCosts?.edges ?? [],
    [
      "id",
      "profileId",
      "parentId",
      "costCategoryId",
      "newEligibleCosts",
      "originalCostsClaimedToDate",
      "originalCostsClaimedToDate",
      "originalEligibleCosts",
    ],
    {
      overrides: claimOverrides,
    },
  );

  return { project, partners, pcrItem, financialVirementsForParticipants, financialVirementsForCosts };
};

export const useOnUpdatePartnerLevel = (
  projectId: ProjectId,
  pcrId: PcrId,
  pcrItemId: PcrItemId,
  navigateTo: string,
) => {
  const navigate = useNavigate();

  return useOnUpdate({
    req: (financialVirement: ReturnType<typeof getPayload>) =>
      clientsideApiClient.financialVirements.update({
        projectId,
        pcrId,
        pcrItemId,
        financialVirement,
        submit: true,
      }),
    onSuccess: () => navigate(navigateTo),
  });
};

export const getPayload = (
  data: EditPartnerLevelSchema,
  virementData: ReturnType<typeof useMapVirements>["virementData"],
  itemId: PcrItemId,
) => {
  const newRemainingGrantTotal = roundCurrency(
    sumBy(data.virements, x => Number(x.newRemainingGrant.replace("£", ""))),
  );

  const newFundingLevelTotal = (newRemainingGrantTotal / virementData.newRemainingCosts) * 100;

  return {
    pcrItemId: itemId,
    ...pick(virementData, [
      "costsClaimedToDate",
      "originalEligibleCosts",
      "originalRemainingCosts",
      "originalRemainingGrant",
      "originalFundingLevel",
      "newEligibleCosts",
      "newRemainingCosts",
    ]),
    newFundingLevel: newFundingLevelTotal,
    newRemainingGrant: newRemainingGrantTotal,
    partners: virementData.virements.map(x => {
      const matchingPartner = data.virements.find(v => v.partnerId === x.partnerId);
      if (!matchingPartner) throw new Error("cannot find matching partner id");

      const newRemainingGrant = Number(matchingPartner.newRemainingGrant.replace("£", ""));
      const newFundingLevel = (newRemainingGrant / x.newRemainingCosts) * 100;

      return {
        ...pick(x, [
          "partnerId",
          "costsClaimedToDate",
          "originalEligibleCosts",
          "originalRemainingCosts",
          "originalRemainingGrant",
          "originalFundingLevel",
          "newEligibleCosts",
          "newRemainingCosts",
        ]),
        newRemainingGrant,
        newFundingLevel,
        virements: x.virements.map(virement => ({
          ...pick(virement, [
            "originalEligibleCosts",
            "newEligibleCosts",
            "originalRemainingGrant",
            "newRemainingGrant",
            "originalRemainingCosts",
            "newRemainingCosts",
            "costCategoryId",
          ]),
          costsClaimedToDate: virement.originalCostsClaimedToDate,
        })),
      };
    }),
  };
};
