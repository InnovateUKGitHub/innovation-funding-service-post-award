import { useNavigate } from "react-router-dom";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { useMessageContext } from "@ui/context/messages";
import { z } from "zod";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { PCRItemStatus } from "@framework/constants/pcrConstants";
import { FinanceDetailsSchemaType } from "./schemas/financialDetails.zod";

export const useOnUpdateAddPartnerFinancialDetails = () => {
  const navigate = useNavigate();

  const { setFetchKey, pcrId, itemId, projectId, step } = usePcrWorkflowContext();
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<FinanceDetailsSchemaType>, boolean, { link: ILinkInfo }>({
    req: data =>
      clientsideApiClient.pcrs.addPartnerFinancialDetails({
        projectId,
        pcrId,
        pcrItemId: itemId,
        pcr: {
          ...data,
          form: data.form,
          ...(typeof step === "number" ? { status: PCRItemStatus.Incomplete } : {}),
        },
      }),
    onSuccess: async function (
      _: z.output<FinanceDetailsSchemaType>,
      __: boolean,
      context: { link: ILinkInfo } | undefined,
    ) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
