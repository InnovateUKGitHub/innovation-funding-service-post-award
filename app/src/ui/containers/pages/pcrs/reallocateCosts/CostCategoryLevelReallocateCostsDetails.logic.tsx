import { useLazyLoadQuery } from "react-relay";
import { costCategoryLevelReallocateCostsDetails } from "./CostCategoryLevelReallocateCostsDetails.query";
import { CostCategoryLevelReallocateCostsDetailsQuery } from "./__generated__/CostCategoryLevelReallocateCostsDetailsQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPcrDto } from "@gql/dtoMapper/mapPcrDto";

const usePcrCostCategoryLevelReallocateCostsDetailsData = ({ pcrId }: { pcrId: PcrId }) => {
  const data = useLazyLoadQuery<CostCategoryLevelReallocateCostsDetailsQuery>(costCategoryLevelReallocateCostsDetails, {
    pcrId,
  });

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

export { usePcrCostCategoryLevelReallocateCostsDetailsData };
