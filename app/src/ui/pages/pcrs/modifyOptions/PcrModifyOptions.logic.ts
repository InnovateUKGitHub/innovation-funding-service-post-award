import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { useRoutes } from "@ui/context/routesProvider";
import { PcrModifyTypesSchemaType } from "@ui/zod/pcrValidator.zod";
import { useLazyLoadQuery, useMutation } from "react-relay";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { PcrModifyOptionsQuery } from "./__generated__/PcrModifyOptionsQuery.graphql";
import { pcrModifyOptionsQuery } from "./PcrModifyOptions.query";
import {
  PcrModifyOptionsCreateHeaderMutation,
  PcrModifyOptionsCreateHeaderMutation$data,
} from "./__generated__/PcrModifyOptionsCreateHeaderMutation.graphql";
import { pcrModifyOptionsCreateHeaderMutation } from "./PcrModifyOptionsCreateHeader.mutation";
import { useState } from "react";
import { PcrModifyOptionsCreateMultipleMutation } from "./__generated__/PcrModifyOptionsCreateMultipleMutation.graphql";
import { pcrModifyOptionsCreateMultipleMutation } from "./PcrModifyOptionsCreateMultiple.mutation";

import { GraphqlError, isGraphqlError } from "@framework/types/IAppError";
import { scrollToTheTopSmoothly } from "@framework/util/windowHelpers";
import { useRecordTypesContext } from "@ui/context/recordTypes";

const usePcrModifyOptionsQuery = ({ projectId }: { projectId: ProjectId }) => {
  const data = useLazyLoadQuery<PcrModifyOptionsQuery>(
    pcrModifyOptionsQuery,
    { projectId },
    { fetchPolicy: "network-only" },
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce.uiapi.query.Acc_Project__c?.edges);
  const project = mapToProjectDto(projectNode, ["id", "competitionType"]);
  const pcrs = mapToPcrDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges ?? [],
    ["id", "status"],
    ["id", "type", "typeName", "shortName"],
    {},
  );
  const numberOfPartners = data.salesforce.uiapi.query.Acc_ProjectParticipant__c?.totalCount ?? 0;

  return { project, pcrs, numberOfPartners, fragmentRef: data.salesforce.uiapi };
};

type MutationVariables = {
  projectId: ProjectId;
  projectIdStr: ProjectId;
  createNewHeader: boolean;
  headerId: PcrId;
  hasPcr2: boolean;
  hasPcr3: boolean;
  hasPcr4: boolean;
  hasPcr5: boolean;
  recordType1: string;
  recordType2: string | null;
  recordType3: string | null;
  recordType4: string | null;
  recordType5: string | null;
};

export const makeVariables = (projectId: ProjectId, headerId: PcrId, pcrTypes: string[]): MutationVariables => {
  if (pcrTypes.length > 5) {
    throw new Error("can't support more than five pcr types in one request");
  }

  return {
    projectId,
    projectIdStr: projectId,
    headerId,
    hasPcr2: false,
    hasPcr3: false,
    hasPcr4: false,
    hasPcr5: false,
    ...pcrTypes.reduce(
      (acc, cur, index) => ({
        ...acc,
        [`hasPcr${index + 1}`]: true,
        [`recordType${index + 1}`]: cur,
      }),
      {},
    ),
  } as MutationVariables;
};

const useOnSubmit = ({ pcrId, projectId }: { pcrId: PcrId | null; projectId: ProjectId }) => {
  const navigate = useNavigate();
  const routes = useRoutes();

  const { getPcrRecordIdFromItemType } = useRecordTypesContext();

  const [commitCreateHeaderMutation, isCreateHeaderMutationInProgress] =
    useMutation<PcrModifyOptionsCreateHeaderMutation>(pcrModifyOptionsCreateHeaderMutation);

  const [commitCreatePcrMutation, isCreatePcrMutationInProgress] = useMutation<PcrModifyOptionsCreateMultipleMutation>(
    pcrModifyOptionsCreateMultipleMutation,
  );

  const [apiError, setApiError] = useState<GraphqlError | null>(null);

  if (pcrId) {
    return {
      onUpdate: (data: { data: z.output<PcrModifyTypesSchemaType> }) => {
        const childPcrs = data.data.types.map(getPcrRecordIdFromItemType);

        const variables = makeVariables(projectId, pcrId, childPcrs);
        commitCreatePcrMutation({
          variables,

          onError: (er: unknown) => {
            if (isGraphqlError(er)) {
              setApiError(er);
              scrollToTheTopSmoothly();
            }
          },
          onCompleted: () => {
            navigate(routes.pcrPrepare.getLink({ pcrId, projectId }).path);
          },
        });
      },

      isFetching: isCreatePcrMutationInProgress,
      apiError,
    };
  }

  return {
    onUpdate: (data: { data: z.output<PcrModifyTypesSchemaType> }) => {
      commitCreateHeaderMutation({
        variables: { projectId, projectIdStr: projectId },
        onError: (er: unknown) => {
          if (isGraphqlError(er)) {
            setApiError(er);
            scrollToTheTopSmoothly();
          }
        },
        onCompleted: (res: PcrModifyOptionsCreateHeaderMutation$data) => {
          const pcrId = res.uiapi.Acc_ProjectChangeRequest__cCreate?.Record?.Id as PcrId;

          const childPcrs = data.data.types.map(getPcrRecordIdFromItemType);

          const variables = makeVariables(projectId, pcrId, childPcrs);
          commitCreatePcrMutation({
            variables,

            onError: (er: unknown) => {
              if (isGraphqlError(er)) {
                setApiError(er);
                scrollToTheTopSmoothly();
              }
            },
            onCompleted: () => {
              navigate(routes.pcrPrepare.getLink({ pcrId, projectId }).path);
            },
          });
        },
      });
    },
    isFetching: isCreateHeaderMutationInProgress || isCreatePcrMutationInProgress,
    apiError,
  };
};

export { useOnSubmit, usePcrModifyOptionsQuery };
