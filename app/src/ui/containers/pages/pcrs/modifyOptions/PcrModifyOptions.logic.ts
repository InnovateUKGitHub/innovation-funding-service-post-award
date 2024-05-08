import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { PCRItemStatus, PCRStatus } from "@framework/constants/pcrConstants";
import { PCRDto, PCRItemDto } from "@framework/dtos/pcrDtos";
import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { clientsideApiClient } from "@ui/apiClient";
import { useRoutes } from "@ui/redux/routesProvider";
import { PcrModifyTypesSchemaType } from "@ui/zod/pcrValidator.zod";
import { useLazyLoadQuery } from "react-relay";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { PcrModifyOptionsQuery } from "./__generated__/PcrModifyOptionsQuery.graphql";
import { pcrModifyOptionsQuery } from "./PcrModifyOptions.query";

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

const useOnSubmit = () => {
  const navigate = useNavigate();
  const routes = useRoutes();

  return useOnUpdate<z.output<PcrModifyTypesSchemaType>, PCRDto, EmptyObject>({
    req: async data => {
      if ("pcrId" in data) {
        return await clientsideApiClient.pcrs.update({
          id: data.pcrId,
          projectId: data.projectId,
          pcr: {
            id: data.pcrId,
            projectId: data.projectId,
            items: data.types.map(x => ({ type: x, status: PCRItemStatus.ToDo })) as PCRItemDto[],
          },
        });
      } else {
        return await clientsideApiClient.pcrs.create({
          projectId: data.projectId,
          projectChangeRequestDto: {
            projectId: data.projectId,
            status: PCRStatus.DraftWithProjectManager,
            reasoningStatus: PCRItemStatus.ToDo,
            items: data.types.map(x => ({ type: x, status: PCRItemStatus.ToDo })) as PCRItemDto[],
          },
        });
      }
    },
    onSuccess(data, res) {
      navigate(routes.pcrPrepare.getLink({ pcrId: res.id, projectId: res.projectId }).path);
    },
  });
};

export { useOnSubmit, usePcrModifyOptionsQuery };
