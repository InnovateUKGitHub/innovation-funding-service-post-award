import { useLazyLoadQuery } from "react-relay";
import { renamePartnerWorkflowQuery } from "./RenamePartner.query";
import { RenamePartnerWorkflowQuery } from "./__generated__/RenamePartnerWorkflowQuery.graphql";
import { getFirstEdge } from "@gql/selectors/edges";
import { mapToProjectDto } from "@gql/dtoMapper/mapProjectDto";
import { mapPcrItemDto } from "@gql/dtoMapper/mapPcrDto";
import { mapToPartnerDtoArray } from "@gql/dtoMapper/mapPartnerDto";
import { sortPartnersLeadFirst } from "@framework/util/partnerHelper";
import { mapToDocumentSummaryDto } from "@gql/dtoMapper/mapDocumentsDto";
import { useNavigate } from "react-router-dom";
import { useMessageContext } from "@ui/context/messages";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { RenamePartnerSchema } from "./renamePartner.zod";
import { clientsideApiClient } from "@ui/apiClient";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { usePcrWorkflowContext } from "../pcrItemWorkflow";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { z } from "zod";

export const useRenamePartnerWorkflowQuery = (projectId: ProjectId, pcrItemId: PcrItemId, fetchKey: number) => {
  const data = useLazyLoadQuery<RenamePartnerWorkflowQuery>(
    renamePartnerWorkflowQuery,
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
        pcrId: pcrItemId,
      },
    ),
  );

  const pcrItem = mapPcrItemDto(pcrNode, ["accountName", "partnerId", "partnerNameSnapshot", "status", "type"], {});

  return { project, pcrItem, partners, documents, fragmentRef: data?.salesforce?.uiapi };
};

export const useOnUpdateRenamePartner = () => {
  const navigate = useNavigate();

  const { setFetchKey, pcrId, itemId, projectId, step } = usePcrWorkflowContext();
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<RenamePartnerSchema>, boolean, { link: ILinkInfo }>({
    req: data =>
      clientsideApiClient.pcrs.renamePartner({
        projectId,
        pcrId,
        pcrItemId: itemId,
        pcr: {
          markedAsComplete: data.markedAsComplete,
          form: data.form,
          partnerId: data.partnerId ?? null,
          accountName: data.accountName ?? null,
          existingAccountName: data.existingAccountName ?? null,
          ...(typeof step === "number" ? { status: PCRItemStatus.Incomplete } : {}),
        },
      }),
    onSuccess: async function (
      _: z.output<RenamePartnerSchema>,
      __: boolean,
      context: { link: ILinkInfo } | undefined,
    ) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
