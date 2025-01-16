import { useNavigate } from "react-router-dom";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { useMessageContext } from "@ui/context/messages";
import { z } from "zod";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { ProjectManagerSchemaType } from "./schemas/projectManager.zod";

export const useOnUpdateAddPartnerProjectManager = () => {
  const navigate = useNavigate();

  const { setFetchKey, pcrId, itemId, projectId, step } = usePcrWorkflowContext();
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<ProjectManagerSchemaType>, boolean, { link: ILinkInfo }>({
    req: data =>
      clientsideApiClient.pcrs.addPartnerProjectManager({
        projectId,
        pcrId,
        pcrItemId: itemId,
        pcr: {
          ...data,
          form: data.form,
          contact2Email: data.contact2Email,
          contact2Forename: data.contact2Forename,
          contact2Surname: data.contact2Surname,
          contact2Phone: data.contact2Phone,
          ...(typeof step === "number" ? { status: PCRItemStatus.Incomplete } : {}),
        },
      }),
    onSuccess: async function (
      _: z.output<ProjectManagerSchemaType>,
      __: boolean,
      context: { link: ILinkInfo } | undefined,
    ) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
