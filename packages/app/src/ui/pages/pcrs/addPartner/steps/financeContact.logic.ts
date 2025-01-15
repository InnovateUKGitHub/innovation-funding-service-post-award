import { useNavigate } from "react-router-dom";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { useMessageContext } from "@ui/context/messages";
import { z } from "zod";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { FinanceContactSchemaType } from "./schemas/financeContact.zod";

export const useOnUpdateAddPartnerFinanceContact = () => {
  const navigate = useNavigate();

  const { setFetchKey, pcrId, itemId, projectId, step } = usePcrWorkflowContext();
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<FinanceContactSchemaType>, boolean, { link: ILinkInfo }>({
    req: data =>
      clientsideApiClient.pcrs.addPartnerFinanceContact({
        projectId,
        pcrId,
        pcrItemId: itemId,
        pcr: {
          ...data,
          form: data.form,
          contact1Email: data.contact1Email,
          contact1Forename: data.contact1Forename,
          contact1Surname: data.contact1Surname,
          contact1Phone: data.contact1Phone,
          ...(typeof step === "number" ? { status: PCRItemStatus.Incomplete } : {}),
        },
      }),
    onSuccess: async function (
      _: z.output<FinanceContactSchemaType>,
      __: boolean,
      context: { link: ILinkInfo } | undefined,
    ) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
