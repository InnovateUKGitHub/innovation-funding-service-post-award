import { useLazyLoadQuery } from "react-relay";
import { costCategoryLevelFinancialVirementDetails } from "./CostCategoryLevelFinancialVirementDetails.query";
import { CostCategoryLevelFinancialVirementDetailsQuery } from "./__generated__/CostCategoryLevelFinancialVirementDetailsQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPcrDto } from "@gql/dtoMapper/mapPcrDto";

const usePcrCostCategoryLevelFinancialVirementDetailsData = ({ pcrId }: { pcrId: PcrId }) => {
  const data = useLazyLoadQuery<CostCategoryLevelFinancialVirementDetailsQuery>(
    costCategoryLevelFinancialVirementDetails,
    { pcrId },
  );

  const pcr = mapToPcrDto(
    {
      head: getFirstEdge(data.salesforce.uiapi.query.Acc_ProjectChangeRequest__c?.edges).node,
      children: [],
    },
    ["reasoningComments"],
    [],
    {},
  );

  return { pcr };
};

export { usePcrCostCategoryLevelFinancialVirementDetailsData };
