import { useLazyLoadQuery } from "react-relay";
import { removePartnerWorkflowQuery } from "./RemovePartner.query";
import { RemovePartnerWorkflowQuery } from "./__generated__/RemovePartnerWorkflowQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { sortPartnersLeadFirst } from "@framework/util/partnerHelper";
import { mapToDocumentSummaryDto } from "@gql/dtoMapper/mapDocumentsDto";
import { useNavigate } from "react-router-dom";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { useMessageContext } from "@ui/context/messages";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { z } from "zod";
import { RemovePartnerSchema } from "./removePartner.zod";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { clientsideApiClient } from "@ui/apiClient";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export const useRemovePartnerWorkflowQuery = (projectId: ProjectId, pcrItemId: PcrItemId, fetchKey: number) => {
  const data = useLazyLoadQuery<RemovePartnerWorkflowQuery>(
    removePartnerWorkflowQuery,
    {
      projectId,
      pcrItemId,
    },
    {
      fetchPolicy: "network-only",
      fetchKey,
    },
  );

  const { node: projectNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_Project__c?.edges);
  const { node: pcrNode } = getFirstEdge(data?.salesforce?.uiapi?.query?.Acc_ProjectChangeRequest__c?.edges);
  const project = mapToProjectDto(projectNode, ["projectNumber", "status", "title", "roles", "numberOfPeriods"]);

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
        pcrId: pcrItemId,
      },
    ),
  );

  const pcrItem = mapPcrItemDto(
    pcrNode,
    ["accountName", "partnerId", "partnerNameSnapshot", "status", "type", "removalPeriod"],
    {},
  );

  return { project, pcrItem, partners, documents, fragmentRef: data?.salesforce?.uiapi };
};

export const useOnUpdateRemovePartner = () => {
  const navigate = useNavigate();

  const { setFetchKey, pcrId, itemId, projectId, step } = usePcrWorkflowContext();
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<RemovePartnerSchema>, boolean, { link: ILinkInfo }>({
    req: data =>
      clientsideApiClient.pcrs.removePartner({
        projectId,
        pcrId,
        pcrItemId: itemId,
        pcr: {
          markedAsComplete: data.markedAsComplete,
          form: data.form,
          numberOfPeriods: data.numberOfPeriods,
          removalPeriod: data.removalPeriod,
          partnerId: data.partnerId,
          ...(typeof step === "number" ? { status: PCRItemStatus.Incomplete } : {}),
        },
      }),
    onSuccess: async function (
      _: z.output<RemovePartnerSchema>,
      __: boolean,
      context: { link: ILinkInfo } | undefined,
    ) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
