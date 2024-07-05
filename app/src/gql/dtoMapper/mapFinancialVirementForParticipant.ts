import { PartnerFinancialVirement } from "@framework/entities/financialVirement";

type FinancialVirementForParticipantNode = GQL.PartialNode<{
  Id: string;

  // Relationships
  Acc_ProjectChangeRequest__c: GQL.Value<string>;
  Acc_ProjectParticipant__c: GQL.Value<string>;

  // Fields
  Acc_NewAwardRate__c: GQL.Value<number>;
  Acc_CurrentAwardRate__c: GQL.Value<number>;
  Acc_NewTotalEligibleCosts__c: GQL.Value<number>;
  Acc_NewRemainingGrant__c: GQL.Value<number>;
}>;

export type FinancialVirementForParticipantMapping = Pick<
  PartnerFinancialVirement,
  | "id"
  | "pcrItemId"
  | "partnerId"
  | "newFundingLevel"
  | "originalFundingLevel"
  | "newEligibleCosts"
  | "newRemainingGrant"
>;

const mapper: GQL.DtoMapper<FinancialVirementForParticipantMapping, FinancialVirementForParticipantNode> = {
  id(node) {
    return (node?.Id ?? "unknown financial virement for project participant id") as FinancialVirementForParticipantId;
  },
  pcrItemId(node) {
    return node?.Acc_ProjectChangeRequest__c?.value as PcrItemId;
  },
  partnerId(node) {
    return node?.Acc_ProjectParticipant__c?.value as PartnerId;
  },
  newFundingLevel(node) {
    return node?.Acc_NewAwardRate__c?.value ?? 0;
  },
  originalFundingLevel(node) {
    return node?.Acc_CurrentAwardRate__c?.value ?? 0;
  },
  newEligibleCosts(node) {
    return node?.Acc_NewTotalEligibleCosts__c?.value ?? 0;
  },
  newRemainingGrant(node) {
    return node?.Acc_NewRemainingGrant__c?.value ?? 0;
  },
};

const mapToFinancialVirementForParticipantDto = <
  TNode extends FinancialVirementForParticipantNode,
  TPickList extends keyof FinancialVirementForParticipantMapping,
>(
  financialVirementForCostNode: TNode,
  pickList: TPickList[],
): Pick<FinancialVirementForParticipantMapping, TPickList> => {
  return pickList.reduce(
    (dto, field) => {
      dto[field] = mapper[field](financialVirementForCostNode);
      return dto;
    },
    {} as Pick<FinancialVirementForParticipantMapping, TPickList>,
  );
};

const mapToFinancialVirementForParticipantDtoArray = <
  TNode extends ReadonlyArray<GQL.Maybe<{ node: FinancialVirementForParticipantNode }>> | null,
  TPickList extends keyof FinancialVirementForParticipantMapping,
>(
  financialVirementForCostNodeEdges: TNode,
  pickList: TPickList[],
): Pick<FinancialVirementForParticipantMapping, TPickList>[] => {
  return (
    financialVirementForCostNodeEdges?.map(node => {
      return mapToFinancialVirementForParticipantDto(node?.node, pickList);
    }) ?? []
  );
};

export { mapToFinancialVirementForParticipantDto, mapToFinancialVirementForParticipantDtoArray };
