import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { PCRItemType } from "@framework/constants/pcrConstants";
import { PCRDto } from "@framework/dtos/pcrDtos";
import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { clientsideApiClient } from "@ui/apiClient";
import { useRoutes } from "@ui/context/routesProvider";
import { useLazyLoadQuery } from "react-relay";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { PcrModifyOptionsQuery } from "./__generated__/PcrModifyOptionsQuery.graphql";
import { pcrModifyOptionsQuery } from "./PcrModifyOptions.query";
import { PcrCreateSchemaType } from "./pcrModifyOptions.zod";

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

const useOnSubmit = ({ projectId, pcrId }: { projectId: ProjectId; pcrId?: PcrId | null }) => {
  const navigate = useNavigate();
  const routes = useRoutes();

  return useOnUpdate<z.output<PcrCreateSchemaType>, Partial<PCRDto> | null, EmptyObject>({
    req: async data => {
      // need to create a standalone PCR with no header
      if (data.types.length === 1 && data.types[0] === PCRItemType.ManageTeamMembers) {
        return null;
      }

      if (pcrId) {
        return await clientsideApiClient.pcrs.addPcrTypes({
          id: pcrId,
          projectId,
          projectChangeRequestDto: data,
        });
      } else {
        return await clientsideApiClient.pcrs.create({
          projectId,
          projectChangeRequestDto: data,
        });
      }
    },
    onSuccess(data, res) {
      if (data.types.length === 1 && data.types[0] === PCRItemType.ManageTeamMembers) {
        navigate(routes.projectManageTeamMembersDashboard.getLink({ projectId }).path);
      } else {
        if (!res?.id) {
          throw new Error("Failed to return a PcrId");
        }
        navigate(routes.pcrPrepare.getLink({ pcrId: res.id, projectId }).path);
      }
    },
  });
};

export { useOnSubmit, usePcrModifyOptionsQuery };
