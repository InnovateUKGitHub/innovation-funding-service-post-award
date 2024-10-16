import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { parseCurrency } from "@framework/util/numberHelper";
import { clientsideApiClient } from "@ui/apiClient";
import { useRoutes } from "@ui/context/routesProvider";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { FinancialVirementForCost, MapVirements, mapVirements } from "../../../utils/useMapFinancialVirements";
import { CostCategoryLevelReallocateCostsEditSchemaType } from "./CostCategoryLevelReallocateCostsEdit.zod";

const patchFinancialVirementsForCosts = (
  financialVirementForCosts: FinancialVirementForCost[],
  virements?: z.input<CostCategoryLevelReallocateCostsEditSchemaType>["virements"],
): FinancialVirementForCost[] => {
  return financialVirementForCosts.map(x => {
    const editedCosts = virements?.find(y => y.virementCostId === x.id);
    return {
      ...x,
      ...(editedCosts ? { newEligibleCosts: parseCurrency(editedCosts.newEligibleCosts) } : {}),
    };
  });
};

export const useOnUpdateCostCategoryLevel = ({
  mapFinancialVirement,
}: {
  mapFinancialVirement: ReturnType<typeof useMapOverwrittenFinancialVirements>;
}) => {
  const routes = useRoutes();
  const navigate = useNavigate();

  return useOnUpdate<z.output<CostCategoryLevelReallocateCostsEditSchemaType>, unknown>({
    req: data => {
      return clientsideApiClient.financialVirements.update({
        projectId: data.projectId,
        pcrId: data.pcrId,
        pcrItemId: data.pcrItemId,
        financialVirement: mapFinancialVirement(data.virements).virementData,
        submit: false,
      });
    },
    onSuccess: data =>
      navigate(
        routes.pcrPrepareItem.getLink({
          projectId: data.projectId,
          pcrId: data.pcrId,
          itemId: data.pcrItemId,
        }).path,
      ),
  });
};

export const mapOverwrittenFinancialVirements =
  ({
    financialVirementsForCosts,
    financialVirementsForParticipants,
    claimOverrideAwardRates,
    partners,
    pcrItemId,
    currentPartnerId,
  }: MapVirements) =>
  (virements?: z.input<CostCategoryLevelReallocateCostsEditSchemaType>["virements"]) =>
    mapVirements({
      financialVirementsForCosts: patchFinancialVirementsForCosts(financialVirementsForCosts, virements),
      financialVirementsForParticipants,
      claimOverrideAwardRates,
      partners,
      pcrItemId,
      currentPartnerId,
    });

export const useMapOverwrittenFinancialVirements = (props: MapVirements) =>
  useMemo(
    () => mapOverwrittenFinancialVirements(props),
    [props.financialVirementsForCosts, props.financialVirementsForParticipants, props.partners, props.pcrItemId],
  );

export { patchFinancialVirementsForCosts };
