import { useNavigate } from "react-router-dom";
import { useMessageContext } from "@ui/context/messages";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { z } from "zod";
import { clientsideApiClient } from "@ui/apiClient";
import { OtherCostsSchemaType } from "./spendProfile.zod";
import { useContext } from "react";
import { SpendProfileContext } from "./spendProfileCosts.logic";

export const useOnUpdateOtherCosts = () => {
  const navigate = useNavigate();

  const { pcrId, itemId, projectId, setFetchKey } = useContext(SpendProfileContext);
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<OtherCostsSchemaType>, boolean, { link: ILinkInfo }>({
    req: data => {
      const payload = {
        projectId,
        pcrId,
        pcrItemId: itemId,
        pcr: {
          id: data.id || null,
          description: data.otherCostDescription,
          value: data.estimatedCost || null,
          form: data.form,
          costCategoryType: data.costCategoryType,
          costCategoryId: data.costCategoryId,
        },
      };

      return clientsideApiClient.pcrs.addPartnerProjectCostOtherCost(payload);
    },
    onSuccess: async function (
      _: z.output<OtherCostsSchemaType>,
      __: boolean,
      context: { link: ILinkInfo } | undefined,
    ) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
