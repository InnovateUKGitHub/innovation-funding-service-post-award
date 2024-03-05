import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { roundCurrency } from "@framework/util/numberHelper";
import { pick, sumBy } from "lodash";
import { useNavigate } from "react-router-dom";
import { useMapFinancialVirements } from "../../../utils/useMapFinancialVirements";
import { EditPartnerLevelSchema } from "./editPartnerLevel.zod";

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
  virementData: ReturnType<typeof useMapFinancialVirements>["virementData"],
  itemId: PcrItemId,
) => {
  const newRemainingGrantTotal = roundCurrency(sumBy(data.partners, x => Number(x.newRemainingGrant.replace("£", ""))));

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
    partners: virementData.partners.map(x => {
      const matchingPartner = data.partners.find(v => v.partnerId === x.partnerId);
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
          costsClaimedToDate: virement.costsClaimedToDate,
        })),
      };
    }),
  };
};
