import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { loanDrawdownChangeQuery } from "./LoanDrawdownChange.query";
import { LoanDrawdownChangeQuery } from "./__generated__/LoanDrawdownChangeQuery.graphql";
import { mapLoanFinancialVirementDtoArray } from "@gql/dtoMapper/mapFinancialLoanVirementDto";
import { LoanDrawdownChangeSchema, LoanDrawdownChangeSummarySchema } from "./loanDrawdownChange.zod";
import { pcrUpdater } from "../pcrItemWorkflow.logic";

export const useLoanDrawdownChangeQuery = (pcrItemId: PcrItemId, fetchKey: number) => {
  const data = useLazyLoadQuery<LoanDrawdownChangeQuery>(
    loanDrawdownChangeQuery,
    {
      pcrItemId,
    },
    {
      fetchPolicy: "network-only",
      fetchKey,
    },
  );

  const { node: pcrNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges);

  const pcrItem = mapPcrItemDto(pcrNode, ["status", "type"], {});

  const loans = mapLoanFinancialVirementDtoArray(data?.salesforce?.uiapi?.query?.Acc_Virements__c?.edges ?? [], [
    "currentDate",
    "currentValue",
    "id",
    "isEditable",
    "newDate",
    "newValue",
    "period",
    "status",
  ]);
  return { pcrItem, loans, fragmentRef: data?.salesforce?.uiapi };
};

export const useOnUpdateLoanChange = () => {
  return pcrUpdater<LoanDrawdownChangeSchema>("loanDrawdownChange");
};

export const useOnUpdateLoanChangeSummary = () => {
  return pcrUpdater<LoanDrawdownChangeSummarySchema>("loanDrawdownChange");
};
