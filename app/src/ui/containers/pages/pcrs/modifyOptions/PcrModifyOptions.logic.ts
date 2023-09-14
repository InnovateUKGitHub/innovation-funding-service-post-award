import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { SalesforceCompetitionTypes } from "@framework/constants/competitionTypes";
import {
  getPcrItemsSingleInstanceInAnyPcrViolations,
  getPcrItemsSingleInstanceInThisPcrViolations,
  getPcrItemsTooManyViolations,
  PCRItemDisabledReason,
  PCRItemStatus,
  PCRStatus,
  recordTypeMetaValues,
} from "@framework/constants/pcrConstants";
import { PCRDto, PCRItemDto, PCRSummaryDto } from "@framework/dtos/pcrDtos";
import { mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { getFirstEdge } from "@gql/selectors/edges";
import { clientsideApiClient } from "@ui/apiClient";
import { useContent } from "@ui/hooks/content.hook";
import { useRoutes } from "@ui/redux/routesProvider";
import { PcrModifyTypesSchemaType } from "@ui/zod/pcrValidator.zod";
import { useLazyLoadQuery } from "react-relay";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { pcrModifyOptionsQuery } from "./PcrModifyOptions.query";
import { PcrModifyOptionsQuery } from "./__generated__/PcrModifyOptionsQuery.graphql";

const usePcrItemsForThisCategory = (
  competitionType: SalesforceCompetitionTypes,
  allPcrs: Pick<PCRSummaryDto, "status" | "items" | "id">[],
  pcrId: PcrId | undefined,
  numberOfPartners: number,
) => {
  const { getContent } = useContent();

  const items = recordTypeMetaValues.filter(x => !(x.ignoredCompetitions.includes(competitionType) || x.deprecated));

  const anyOtherPcrViolations = getPcrItemsSingleInstanceInAnyPcrViolations(allPcrs);
  const thisPcrViolations = getPcrItemsSingleInstanceInThisPcrViolations(allPcrs.find(x => x.id === pcrId));
  const tooManyViolations = getPcrItemsTooManyViolations(
    numberOfPartners,
    allPcrs.find(x => x.id === pcrId),
  );

  return items.map(pcrItem => {
    let disabledReason = PCRItemDisabledReason.None;

    if (thisPcrViolations.includes(pcrItem.type)) {
      disabledReason = PCRItemDisabledReason.ThisPcrAlreadyHasThisType;
    } else if (anyOtherPcrViolations.includes(pcrItem.type)) {
      disabledReason = PCRItemDisabledReason.AnotherPcrAlreadyHasThisType;
    } else if (tooManyViolations.includes(pcrItem.type)) {
      disabledReason = PCRItemDisabledReason.NotEnoughPartnersToActionThisType;
    }

    return {
      item: pcrItem,
      displayName: (pcrItem.i18nName ? getContent(pcrItem.i18nName) : pcrItem.displayName) ?? pcrItem.typeName,
      type: pcrItem.type,
      disabled: disabledReason !== PCRItemDisabledReason.None,
      disabledReason,
    };
  });
};

const usePcrModifyOptionsQuery = ({ projectId }: { projectId: ProjectId }) => {
  const data = useLazyLoadQuery<PcrModifyOptionsQuery>(
    pcrModifyOptionsQuery,
    { projectId },
    { fetchPolicy: "network-only" },
  );
  const { node: projectNode } = getFirstEdge(data?.salesforce.uiapi.query.Acc_Project__c?.edges);
  const project = mapToProjectDto(projectNode, ["id", "competitionType", "title", "projectNumber"]);
  const pcrs = mapToPcrDtoArray(
    data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges ?? [],
    ["id", "status"],
    ["id", "type", "typeName", "shortName"],
    {},
  );
  const numberOfPartners = data.salesforce.uiapi.query.Acc_ProjectParticipant__c?.totalCount ?? 0;

  return { project, pcrs, numberOfPartners };
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
            status: PCRStatus.Draft,
            reasoningStatus: PCRItemStatus.ToDo,
            items: data.types.map(x => ({ type: x, status: PCRItemStatus.ToDo })) as PCRItemDto[],
          },
        });
      } else {
        return await clientsideApiClient.pcrs.create({
          projectId: data.projectId,
          projectChangeRequestDto: {
            projectId: data.projectId,
            status: PCRStatus.Draft,
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

export { usePcrItemsForThisCategory, usePcrModifyOptionsQuery, useOnSubmit };
