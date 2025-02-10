import { OverheadDocumentsSchemaType, OverheadSchemaType } from "./spendProfile.zod";
import { clientsideApiClient } from "@ui/apiClient";
import { projectCostUpdater } from "./spendProfileCosts.logic";
import { IPCRsApi } from "@server/apis/pcrs";
import { useNavigate } from "react-router-dom";
import { useMessageContext } from "@ui/context/messages";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { z } from "zod";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { useFetchKey } from "@ui/context/FetchKeyProvider";

export const useOnUpdateOverheads = () => {
  return projectCostUpdater<OverheadSchemaType, IPCRsApi<"client">["addPartnerProjectCostOverhead"]>(
    clientsideApiClient.pcrs.addPartnerProjectCostOverhead,
  );
};

export const useOnUpdateOverheadDocuments = () => {
  const navigate = useNavigate();

  const [, setFetchKey] = useFetchKey();
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<OverheadDocumentsSchemaType>, boolean, { link: ILinkInfo }>({
    req: () => Promise.resolve(true),
    onSuccess: async function (
      _: z.output<OverheadDocumentsSchemaType>,
      __: boolean,
      context: { link: ILinkInfo } | undefined,
    ) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
