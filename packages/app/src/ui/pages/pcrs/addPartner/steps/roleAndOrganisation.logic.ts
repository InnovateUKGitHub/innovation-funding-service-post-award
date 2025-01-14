import { useNavigate } from "react-router-dom";
import { usePcrWorkflowContext } from "../../pcrItemWorkflow";
import { useMessageContext } from "@ui/context/messages";
import { z } from "zod";
import { useOnUpdate } from "@framework/api-helpers/onUpdate";
import { clientsideApiClient } from "@ui/apiClient";
import { ILinkInfo } from "@framework/types/ILinkInfo";
import { RoleAndOrganisationSchemaType } from "./schemas/roleAndOrganisation.zod";
import {
  getPCROrganisationType,
  PCRItemStatus,
  PCROrganisationType,
  PCRParticipantSize,
} from "@framework/constants/pcrConstants";

export const setData = (data: z.output<RoleAndOrganisationSchemaType>) => {
  // It's not possible to come back to this page after it's submitted
  // so we can assume that the participant size hasn't explicitly been set by the user yet
  // and it's safe for us to reset it
  let participantSize = PCRParticipantSize.Unknown;

  // If the partner type is academic then the organisation step is skipped and the participant size is set to "Academic"
  const organisationType = getPCROrganisationType(data.partnerType);
  if (organisationType === PCROrganisationType.Academic) {
    participantSize = PCRParticipantSize.Academic;
  }

  return {
    ...data,
    organisationType,
    participantSize,
    isCommercialWork: data.isCommercialWork === "true",
  };
};

export const useOnUpdateAddPartnerPartnerRoleAndOrganisation = (formHasBeenFilled: boolean) => {
  const navigate = useNavigate();

  const { setFetchKey, pcrId, itemId, projectId, step } = usePcrWorkflowContext();
  const { clearMessages } = useMessageContext();

  return useOnUpdate<z.output<RoleAndOrganisationSchemaType>, boolean, { link: ILinkInfo }>({
    req: data => {
      if (formHasBeenFilled) {
        return Promise.resolve(true);
      } else {
        return clientsideApiClient.pcrs.addPartnerRoleAndOrganisation({
          projectId,
          pcrId,
          pcrItemId: itemId,
          pcr: {
            ...data,
            form: data.form,
            partnerType: data.partnerType,
            projectRole: data.projectRole,
            button_submit: data.button_submit,
            isCommercialWork: data.isCommercialWork,
            ...(typeof step === "number" ? { status: PCRItemStatus.Incomplete } : {}),
          },
        });
      }
    },
    onSuccess: async function (
      _: z.output<RoleAndOrganisationSchemaType>,
      __: boolean,
      context: { link: ILinkInfo } | undefined,
    ) {
      clearMessages();
      setFetchKey(k => k + 1);
      navigate(context?.link?.path ?? "");
    },
  });
};
