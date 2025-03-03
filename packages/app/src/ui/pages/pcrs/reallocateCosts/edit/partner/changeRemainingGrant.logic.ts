import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { useNavigate } from "react-router-dom";
import { ChangeRemainingGrantSchemaType } from "./changeRemainingGrant.zod";
import { z } from "zod";
import { useMessageContext } from "@ui/context/messages";
import { useFetchKey } from "@ui/context/FetchKeyProvider";

export const useOnUpdateChangeRemainingGrant = (
  projectId: ProjectId,
  pcrId: PcrId,
  pcrItemId: PcrItemId,
  navigateTo: string,
) => {
  const navigate = useNavigate();
  const { clearMessages } = useMessageContext();
  const [, setFetchKey] = useFetchKey();

  return useOnUpdate({
    req: (data: z.output<ChangeRemainingGrantSchemaType>) =>
      clientsideApiClient.pcrs.changeRemainingGrant({
        projectId,
        pcrId,
        pcrItemId,
        pcr: data,
      }),
    onSuccess: () => {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(navigateTo);
    },
  });
};

export const getNewFundingLevel = (newRemainingCosts: number, newRemainingGrant: number, newFundingLevel: number) => {
  if (!newRemainingCosts) {
    return newFundingLevel;
  }
  return (newRemainingGrant / newRemainingCosts) * 100;
};
