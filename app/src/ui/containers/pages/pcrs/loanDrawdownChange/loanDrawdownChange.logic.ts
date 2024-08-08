import { useLazyLoadQuery } from "react-relay";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { loanDrawdownChangeQuery } from "./LoanDrawdownChange.query";
import { LoanDrawdownChangeQuery } from "./__generated__/LoanDrawdownChangeQuery.graphql";
import { mapLoanFinancialVirementDtoArray } from "@gql/dtoMapper/mapFinancialLoanVirementDto";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { LoanFinancialVirement } from "@framework/entities/financialVirement";
import { combineDayMonthYear } from "@ui/components/atomicDesign/atoms/Date";
import { LoanDrawdownChangeSchema } from "./loanDrawdownChange.zod";
import { parseCurrency } from "@framework/util/numberHelper";

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

export const useOnUpdateLoanChange = (projectId: ProjectId, pcrItemId: PcrItemId, loans: LoanFinancialVirement[]) => {
  return useOnUpdate<LoanDrawdownChangeSchema, {}>({
    req: data => {
      return clientsideApiClient.financialLoanVirements.update({
        projectId,
        pcrItemId,
        submit: true,
        financialVirement: {
          pcrItemId,
          loans: loans.map(x => {
            const matchingUpdatedData = data.loans.find(y => y.period === x.period);
            const newDate = combineDayMonthYear(
              matchingUpdatedData?.newDate_day,
              matchingUpdatedData?.newDate_month,
              matchingUpdatedData?.newDate_year,
            );

            if (!newDate) {
              throw Error("missing a new date");
            }
            return {
              ...x,
              newDate,
              newValue: parseCurrency(matchingUpdatedData?.newValue),
            };
          }),
        },
      });
    },
  });
};
