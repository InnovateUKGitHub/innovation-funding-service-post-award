import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SpendProfileContext } from "./spendProfileCosts.logic";
import { useMessageContext } from "@ui/context/messages";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { z } from "zod";
import { OverheadSchemaType } from "./spendProfile.zod";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { clientsideApiClient } from "@ui/apiClient";

export const useOnUpdateOverheads = () => {
  const navigate = useNavigate();

  const { pcrId, itemId, projectId, setFetchKey } = useContext(SpendProfileContext);
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<OverheadSchemaType>, boolean, { link: ILinkInfo }>({
    req: data => {
      const payload = {
        projectId,
        pcrId,
        pcrItemId: itemId,
        pcr: data,
      };
      return clientsideApiClient.pcrs.addPartnerProjectCostOverhead(payload);
    },
    onSuccess: async function (_: z.output<OverheadSchemaType>, __: boolean, context: { link: ILinkInfo } | undefined) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
