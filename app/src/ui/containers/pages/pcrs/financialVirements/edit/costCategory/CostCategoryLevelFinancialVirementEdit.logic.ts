import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { parseCurrency } from "@framework/util/numberHelper";
import { mapToClaimOverrides } from "@gql/dtoMapper/mapClaimOverrides";
import { mapToFinancialVirementForCostsDtoArray } from "@gql/dtoMapper/mapFinancialVirementForCosts";
import { mapToFinancialVirementForParticipantDtoArray } from "@gql/dtoMapper/mapFinancialVirementForParticipant";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { clientsideApiClient } from "@ui/apiClient";
import { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { FinancialVirementForCost, MapVirements, mapVirements } from "../../../utils/useMapFinancialVirements";
import { costCategoryLevelFinancialVirementEditQuery } from "./CostCategoryLevelFinancialVirementEdit.query";
import { CostCategoryLevelFinancialVirementEditSchemaType } from "./CostCategoryLevelFinancialVirementEdit.zod";
import { CostCategoryLevelFinancialVirementEditQuery } from "./__generated__/CostCategoryLevelFinancialVirementEditQuery.graphql";
import { useRoutes } from "@ui/redux/routesProvider";

const usePartnerLevelFinancialVirementEditData = ({
  projectId,
  partnerId,
  itemId,
}: {
  projectId: ProjectId;
  partnerId: PartnerId;
  itemId: PcrItemId;
}) => {
  const data = useLazyLoadQuery<CostCategoryLevelFinancialVirementEditQuery>(
    costCategoryLevelFinancialVirementEditQuery,
    { projectId, itemId },
    { fetchPolicy: "network-only" },
  );

  const project = mapToProjectDto(getFirstEdge(data.salesforce.uiapi.query.Acc_Project__c?.edges).node, [
    "title",
    "projectNumber",
    "isNonFec",
    "roles",
    "competitionType",
  ]);

  const partners = mapToPartnerDtoArray(
    data.salesforce.uiapi.query.Acc_ProjectParticipant__c?.edges ?? [],
    ["id", "name", "isLead"],
    {},
  );

  const partner = partners.find(x => x.id === partnerId)!;

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
      "costCategoryName",
      "newEligibleCosts",
      "originalCostsClaimedToDate",
      "originalCostsClaimedToDate",
      "originalEligibleCosts",
    ],
    {
      overrides: claimOverrides,
    },
  );

  return { project, partner, partners, pcrItem, financialVirementsForParticipants, financialVirementsForCosts };
};

const patchFinancialVirementsForCosts = (
  financialVirementForCosts: FinancialVirementForCost[],
  virements?: z.input<CostCategoryLevelFinancialVirementEditSchemaType>["virements"],
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

  return useOnUpdate<z.output<CostCategoryLevelFinancialVirementEditSchemaType>, unknown>({
    req: data => {
      return clientsideApiClient.financialVirements.update({
        projectId: data.projectId,
        pcrId: data.pcrId,
        pcrItemId: data.pcrItemId,
        financialVirement: mapFinancialVirement(data.virements).virementData,
        submit: true,
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
  ({ financialVirementsForCosts, financialVirementsForParticipants, partners, pcrItemId }: MapVirements) =>
  (virements?: z.input<CostCategoryLevelFinancialVirementEditSchemaType>["virements"]) =>
    mapVirements({
      financialVirementsForCosts: patchFinancialVirementsForCosts(financialVirementsForCosts, virements),
      financialVirementsForParticipants,
      partners,
      pcrItemId,
    });

export const useMapOverwrittenFinancialVirements = (props: MapVirements) =>
  useMemo(
    () => mapOverwrittenFinancialVirements(props),
    [props.financialVirementsForCosts, props.financialVirementsForParticipants, props.partners, props.pcrItemId],
  );

export { patchFinancialVirementsForCosts, usePartnerLevelFinancialVirementEditData };
