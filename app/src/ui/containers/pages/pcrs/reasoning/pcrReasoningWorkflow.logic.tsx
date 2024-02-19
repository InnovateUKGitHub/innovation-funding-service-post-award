import { useLazyLoadQuery } from "react-relay";
import { pcrReasoningWorkflowQuery } from "./PcrReasoningWorkflow.query";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapPcrItemDto, mapToPcrDtoArray } from "@gql/dtoMapper/mapPcrDto";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { PcrReasoningWorkflowQuery } from "./__generated__/PcrReasoningWorkflowQuery.graphql";
import { head } from "lodash";
import { getEditableItemTypes } from "@gql/dtoMapper/getEditableItemTypes";
import { mapToDocumentSummaryDto, mapToProjectDocumentSummaryDtoArray } from "@gql/dtoMapper/mapDocumentsDto";
import { RefreshedQueryOptions } from "@gql/hooks/useRefreshQuery";
import { useNavigate } from "react-router-dom";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { useMessages } from "@framework/api-helpers/useMessages";
import { clientsideApiClient } from "@ui/apiClient";
import { FullPCRItemDto, PCRDto } from "@framework/dtos/pcrDtos";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { getNextStepNumber } from "./workflowMetadata";
import { useContent } from "@ui/hooks/content.hook";
import { BackLink } from "@ui/components/atomicDesign/atoms/Links/links";
import { PcrReasoningFilesQuery } from "./__generated__/PcrReasoningFilesQuery.graphql";
import { pcrReasoningFilesQuery } from "./PcrReasoningFiles.query";
import { sortPartnersLeadFirst } from "@framework/util/partnerHelper";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { PcrReasoningSchemaType } from "./pcrReasoning.zod";
import { usePcrReasoningContext } from "./pcrReasoningContext";
import { Dispatch, SetStateAction } from "react";

export const usePcrReasoningQuery = (projectId: ProjectId, pcrId: PcrId, fetchKey: number) => {
  const data = useLazyLoadQuery<PcrReasoningWorkflowQuery>(
    pcrReasoningWorkflowQuery,
    {
      projectId,
      pcrId,
    },
    { fetchPolicy: "network-only", fetchKey },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);

  const project = mapToProjectDto(projectNode, ["title", "status", "projectNumber"]);

  const pcrGql = data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges ?? [];
  const pcr = head(
    mapToPcrDtoArray(
      pcrGql,
      ["id", "projectId", "requestNumber", "reasoningComments", "reasoningStatus"],
      ["shortName", "id", "type", "typeName"],
      {},
    ),
  );

  if (!pcr) throw new Error(`Could not find pcr matching ${pcrId}`);

  const documents = (data?.salesforce?.uiapi?.query?.PcrHeader?.edges ?? []).flatMap(x =>
    mapToProjectDocumentSummaryDtoArray(
      x?.node?.ContentDocumentLinks?.edges ?? [],
      ["id", "dateCreated", "fileSize", "fileName", "link", "uploadedBy", "isOwner", "description"],
      {
        projectId,
        type: "pcr",
        pcrId,
      },
    ),
  );

  const editableItemTypes = getEditableItemTypes(pcr);
  return {
    project,
    pcr,
    editableItemTypes,
    documents,
  };
};

export const usePcrReasoningFilesQuery = (
  projectId: ProjectId,
  pcrId: PcrId,
  refreshedQueryOptions: RefreshedQueryOptions,
) => {
  const data = useLazyLoadQuery<PcrReasoningFilesQuery>(
    pcrReasoningFilesQuery,
    {
      projectId,
      pcrId,
    },
    refreshedQueryOptions,
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: pcrNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges);
  const project = mapToProjectDto(projectNode, ["projectNumber", "status", "title", "roles"]);

  const partners = sortPartnersLeadFirst(
    mapToPartnerDtoArray(
      data?.salesforce?.uiapi?.query?.Acc_ProjectParticipant__c?.edges ?? [],
      ["id", "isLead", "isWithdrawn", "name"],
      {},
    ),
  );

  const documents = (pcrNode?.ContentDocumentLinks?.edges ?? []).map(node =>
    mapToDocumentSummaryDto(
      node,
      ["id", "dateCreated", "description", "fileName", "fileSize", "isOwner", "uploadedBy", "link", "linkedEntityId"],
      {
        type: "pcr",
        projectId,
        pcrId: pcrId,
      },
    ),
  );

  const pcrItem = mapPcrItemDto(pcrNode, ["accountName", "partnerId", "partnerNameSnapshot", "status", "type"], {});

  return { project, pcrItem, partners, documents, fragmentRef: data?.salesforce?.uiapi };
};

export type Mode = "prepare" | "review" | "view";

type PcrDtoForReasoning = Partial<Omit<PCRDto, "items">> & {
  items?: PickRequiredFromPartial<FullPCRItemDto, "id" | "type">[];
};

const createMinimalPcrUpdateDto = ({
  projectId,
  pcrId,
  pcr,
  data,
}: {
  projectId: ProjectId;
  pcrId: PcrId;
  pcr: PcrDtoForReasoning;
  data: Omit<PcrReasoningSchemaType, "markedAsCompleteHasBeenChecked">;
}) => {
  return {
    ...pcr,
    ...data,
    id: pcrId,
    projectId,
  };
};

export const useOnSavePcrReasoning = (
  projectId: ProjectId,
  pcrId: PcrId,
  pcr: PcrDtoForReasoning,
  setFetchKey: Dispatch<SetStateAction<number>>,
) => {
  const navigate = useNavigate();
  const { clearMessages } = useMessages();
  return useOnUpdate<Omit<PcrReasoningSchemaType, "markedAsCompleteHasBeenChecked">, PCRDto, { link: ILinkInfo }>({
    req: data => {
      return clientsideApiClient.pcrs.update({
        projectId,
        id: pcrId,
        pcr: createMinimalPcrUpdateDto({
          pcrId,
          projectId,
          pcr,
          data,
        }),
      });
    },
    onSuccess: (_, __, context) => {
      clearMessages();
      navigate(context?.link?.path ?? "");
      setFetchKey(x => x + 1);
    },
  });
};

export const useNextReasoningLink = () => {
  const { routes, projectId, pcrId, stepNumber } = usePcrReasoningContext();

  return routes.pcrPrepareReasoning.getLink({
    projectId,
    pcrId,
    step: getNextStepNumber(stepNumber),
  });
};

export const useGetBackLink = () => {
  const { mode, projectId, pcrId, routes } = usePcrReasoningContext();
  const { getContent } = useContent();
  if (mode === "review") {
    return (
      <BackLink route={routes.pcrReview.getLink({ projectId, pcrId })}>
        {getContent(x => x.pages.pcrReasoningWorkflow.backLink)}
      </BackLink>
    );
  }
  if (mode === "prepare") {
    return (
      <BackLink route={routes.pcrPrepare.getLink({ projectId, pcrId })}>
        {getContent(x => x.pages.pcrReasoningWorkflow.backLink)}
      </BackLink>
    );
  }
  return (
    <BackLink route={routes.pcrDetails.getLink({ projectId, pcrId })}>
      {getContent(x => x.pages.pcrReasoningWorkflow.backLink)}
    </BackLink>
  );
};
