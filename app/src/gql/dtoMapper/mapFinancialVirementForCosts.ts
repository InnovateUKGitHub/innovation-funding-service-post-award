import { ClaimOverrideRateDto } from "@framework/dtos/claimOverrideRate";
import { CostCategoryFinancialVirement } from "@framework/entities/financialVirement";

type FinancialVirementForCostsNode = GQL.PartialNode<{
  Id: string;

  // Relationships
  Acc_Profile__c: GQL.Value<string>;
  Acc_Profile__r: GQL.Maybe<{
    Id: GQL.Maybe<string>;
    Acc_CostCategory__c: GQL.Value<string>;
    Acc_CostCategory__r?: GQL.Maybe<{
      Acc_CostCategoryName__c: GQL.Value<string>;
    }>;
  }>;
  Acc_ParticipantVirement__c: GQL.Value<string>;

  // Fields
  Acc_CurrentCosts__c: GQL.Value<number>;
  Acc_ClaimedCostsToDate__c: GQL.Value<number>;
  Acc_NewCosts__c: GQL.Value<number>;
}>;

export type FinancialVirementForCostsMapping = CostCategoryFinancialVirement;

interface FinancialVirementForCostsAdditionalData {
  overrides: ClaimOverrideRateDto;
}

const mapper: GQL.DtoMapper<
  FinancialVirementForCostsMapping,
  FinancialVirementForCostsNode,
  FinancialVirementForCostsAdditionalData
> = {
  id(node) {
    return (node?.Id ?? "unknown financial virement for project costs id") as FinancialVirementForCostsId;
  },
  parentId(node) {
    return node?.Acc_ParticipantVirement__c?.value as FinancialVirementForParticipantId;
  },
  profileId(node) {
    return node?.Acc_Profile__c?.value ?? node?.Acc_Profile__r?.Id ?? "unknown profile id";
  },
  costCategoryId(node) {
    return (node?.Acc_Profile__r?.Acc_CostCategory__c?.value ?? "unknown cost category id") as CostCategoryId;
  },
  originalEligibleCosts(node) {
    return node?.Acc_CurrentCosts__c?.value ?? 0;
  },
  originalCostsClaimedToDate(node) {
    return node?.Acc_ClaimedCostsToDate__c?.value ?? 0;
  },
  newEligibleCosts(node) {
    return node?.Acc_NewCosts__c?.value ?? 0;
  },
};

const mapToFinancialVirementForCostsDto = <
  TNode extends FinancialVirementForCostsNode,
  TPickList extends keyof FinancialVirementForCostsMapping,
>(
  financialVirementForCostsNode: TNode,
  pickList: TPickList[],
  additionalData: FinancialVirementForCostsAdditionalData,
): Pick<FinancialVirementForCostsMapping, TPickList> => {
  return pickList.reduce((dto, field) => {
    dto[field] = mapper[field](financialVirementForCostsNode, additionalData);
    return dto;
  }, {} as Pick<FinancialVirementForCostsMapping, TPickList>);
};

const mapToFinancialVirementForCostsDtoArray = <
  TNode extends ReadonlyArray<GQL.Maybe<{ node: FinancialVirementForCostsNode }>> | null,
  TPickList extends keyof FinancialVirementForCostsMapping,
>(
  financialVirementForCostsNodeEdges: TNode,
  pickList: TPickList[],
  additionalData: FinancialVirementForCostsAdditionalData,
): Pick<FinancialVirementForCostsMapping, TPickList>[] => {
  return (
    financialVirementForCostsNodeEdges?.map(node => {
      return mapToFinancialVirementForCostsDto(node?.node, pickList, additionalData);
    }) ?? []
  );
};

export { mapToFinancialVirementForCostsDto, mapToFinancialVirementForCostsDtoArray };
