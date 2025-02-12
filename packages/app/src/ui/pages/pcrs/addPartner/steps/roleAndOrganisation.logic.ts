import { z } from "zod";
import { RoleAndOrganisationSchemaType } from "./schemas/roleAndOrganisation.zod";
import { getPCROrganisationType, PCROrganisationType, PCRParticipantSize } from "@framework/constants/pcrConstants";
import { pcrUpdater } from "../../pcrItemWorkflow.logic";

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

export const useOnUpdateAddPartnerPartnerRoleAndOrganisation = () => {
  return pcrUpdater<RoleAndOrganisationSchemaType>("addPartnerRoleAndOrganisation");
};
