import { useNavigate } from "react-router-dom";
import { useMessageContext } from "@ui/context/messages";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { z } from "zod";
import { clientsideApiClient } from "@ui/apiClient";
import { SubcontractingSchemaType } from "./spendProfile.zod";
import { useContext } from "react";
import { SpendProfileContext } from "./spendProfileCosts.logic";

export const useOnUpdateSubcontracting = () => {
  const navigate = useNavigate();

  const { pcrId, itemId, projectId, setFetchKey } = useContext(SpendProfileContext);
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<SubcontractingSchemaType>, boolean, { link: ILinkInfo }>({
    req: data => {
      return clientsideApiClient.pcrs.addPartnerProjectCostSubcontracting({
        projectId,
        pcrId,
        pcrItemId: itemId,
        pcr: data,
      });
    },
    onSuccess: async function (
      _: z.output<SubcontractingSchemaType>,
      __: boolean,
      context: { link: ILinkInfo } | undefined,
    ) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
