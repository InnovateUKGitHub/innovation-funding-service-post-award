import { useLazyLoadQuery } from "react-relay";
import { pcrDeleteQuery } from "./PcrDelete.query";
import { PcrDeleteQuery } from "./__generated__/PcrDeleteQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { useNavigate } from "react-router-dom";
import { useOnMutation } from "@framework/api-helpers/onUpdate";
import { PcrDeleteMutation } from "./__generated__/PcrDeleteMutation.graphql";
import { pcrDeleteMutation } from "./PcrDelete.mutation";
import { noop } from "lodash";

export const usePcrDeleteQuery = (projectId: ProjectId, pcrId: PcrId) => {
  const data = useLazyLoadQuery<PcrDeleteQuery>(pcrDeleteQuery, { projectId, pcrId }, { fetchPolicy: "network-only" });

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const pcr = mapToPcrDtoArray(
    projectNode?.Project_Change_Requests__r?.edges ?? [],
    ["started", "lastUpdated", "requestNumber"],
    ["shortName"],
    {},
  )[0];

  return { fragmentRef: data.salesforce.uiapi, pcr };
};

export const useOnDeletePcr = (pcrId: PcrId, projectId: ProjectId, navigateTo: string) => {
  const navigate = useNavigate();
  return useOnMutation<PcrDeleteMutation, EmptyObject>(
    pcrDeleteMutation,
    () => ({ pcrId, projectId }),
    () => navigate(navigateTo),
    noop,
  );
};
