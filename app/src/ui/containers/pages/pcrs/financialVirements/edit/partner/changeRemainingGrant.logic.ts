import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { parseCurrency, roundCurrency } from "@framework/util/numberHelper";
import { pick, sumBy } from "lodash";
import { useNavigate } from "react-router-dom";
import { useMapFinancialVirements } from "../../../utils/useMapFinancialVirements";
import { ChangeRemainingGrantSchema } from "./changeRemainingGrant.zod";

export const useOnUpdateChangeRemainingGrant = (
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

export const getNewFundingLevel = (newRemainingCosts: number, newRemainingGrant: number, newFundingLevel: number) => {
  if (!newRemainingCosts) {
    return newFundingLevel;
  }
  return (newRemainingGrant / newRemainingCosts) * 100;
};

export const getPayload = (
  data: ChangeRemainingGrantSchema,
  virementData: ReturnType<typeof useMapFinancialVirements>["virementData"],
  itemId: PcrItemId,
) => {
  const newRemainingGrantTotal = roundCurrency(sumBy(data.partners, x => parseCurrency(x.newRemainingGrant)));

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

      const newRemainingGrant = parseCurrency(matchingPartner.newRemainingGrant);

      const newFundingLevel = getNewFundingLevel(x.newRemainingCosts, newRemainingGrant, x.newFundingLevel);

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
