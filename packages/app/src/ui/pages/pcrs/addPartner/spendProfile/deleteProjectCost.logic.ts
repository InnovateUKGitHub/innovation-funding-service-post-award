import { useNavigate } from "react-router-dom";
import { useMessageContext } from "@ui/context/messages";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { z } from "zod";
import { clientsideApiClient } from "@ui/apiClient";
import { ZodEmptySchema } from "@ui/zod/helperValidators/helperValidators.zod";
import { useFetchKey } from "@ui/context/FetchKeyProvider";

export const useOnDeleteProjectCost = ({
  pcrId,
  itemId,
  projectId,
  costId,
}: {
  pcrId: PcrId;
  itemId: PcrItemId;
  projectId: ProjectId;
  costId: CostId;
}) => {
  const navigate = useNavigate();

  const { clearMessages } = useMessageContext();

  const [, setFetchKey] = useFetchKey();

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
