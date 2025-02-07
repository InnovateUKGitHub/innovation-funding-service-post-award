import { useNavigate } from "react-router-dom";
import { useMessageContext } from "@ui/context/messages";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { z } from "zod";
import { clientsideApiClient } from "@ui/apiClient";
import { useContext } from "react";
import { SpendProfileContext } from "./spendProfileCosts.logic";
import { ZodEmptySchema } from "@ui/zod/helperValidators/helperValidators.zod";

export const useOnDeleteProjectCost = () => {
  const navigate = useNavigate();

  const { pcrId, itemId, projectId, setFetchKey, costId } = useContext(SpendProfileContext);
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<ZodEmptySchema>, boolean, { link: ILinkInfo }>({
    req: () => {
      const payload = {
        projectId,
        pcrId,
        pcrItemId: itemId,
        costId: costId as CostId,
      };

      return clientsideApiClient.pcrs.deleteProjectCost(payload);
    },
    onSuccess: async function (_: z.output<ZodEmptySchema>, __: boolean, context: { link: ILinkInfo } | undefined) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
