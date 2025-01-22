import { IContext } from "@framework/types/IContext";
import { ZodFormHandlerBase } from "@server/htmlFormHandler/zodFormHandlerBase";
import { PCRPrepareItemRoute, ProjectChangeRequestPrepareItemParams } from "@ui/pages/pcrs/pcrItemWorkflowContainer";
import { FormTypes } from "@ui/zod/FormTypes";
import { z } from "zod";
import {
  RoleAndOrganisationSchemaType,
  roleAndOrganisationSchema,
} from "@ui/pages/pcrs/addPartner/steps/schemas/roleAndOrganisation.zod";
import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { getNextAddPartnerStep } from "./addPartnerUtils";
import {
  getPCROrganisationType,
  PCRItemStatus,
  PCROrganisationType,
  PCRParticipantSize,
} from "@framework/constants/pcrConstants";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { PcrPartnerTypeMapper, PcrProjectRoleMapper } from "@server/repositories/mappers/projectChangeRequestMapper";
import { PcrParticipantSizeMapper } from "@framework/mappers/participantSize";

export class PcrItemAddPartnerRoleAndOrganisationHandler extends ZodFormHandlerBase<
  RoleAndOrganisationSchemaType,
  ProjectChangeRequestPrepareItemParams
> {
  constructor() {
    super({
      routes: [PCRPrepareItemRoute],
      forms: [FormTypes.PcrAddPartnerRoleAndOrganisationStep],
    });
  }

  public readonly acceptFiles = false;

  protected async getZodSchema() {
    return {
      schema: roleAndOrganisationSchema,
      errorMap: addPartnerErrorMap,
    };
  }

  protected async mapToZod({ input }: { input: AnyObject }): Promise<z.input<RoleAndOrganisationSchemaType>> {
    return {
      form: input.form,
      button_submit: input.button_submit,
      projectRole: input.projectRole,
      isCommercialWork: input.isCommercialWork,
      partnerType: input.partnerType,
    };
  }

  protected async run({
    input,
    context,
    params,
  }: {
    input: z.output<RoleAndOrganisationSchemaType>;
    context: IContext;
    params: ProjectChangeRequestPrepareItemParams;
  }): Promise<string> {
    // It's not possible to come back to this page after it's submitted
    // so we can assume that the participant size hasn't explicitly been set by the user yet
    // and it's safe for us to reset it
    let participantSize = PCRParticipantSize.Unknown;

    const organisationType = getPCROrganisationType(input.partnerType);
    if (organisationType === PCROrganisationType.Academic) {
      participantSize = PCRParticipantSize.Academic;
    }

    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: params.itemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_CommercialWork__c: input.isCommercialWork === "true",
      Acc_ParticipantType__c: new PcrPartnerTypeMapper().mapToSalesforcePCRPartnerType(input.partnerType),
      Acc_ProjectRole__c: new PcrProjectRoleMapper().mapToSalesforcePCRProjectRole(input.projectRole),
      Acc_ParticipantSize__c: new PcrParticipantSizeMapper().mapToSalesforcePCRParticipantSize(participantSize),
    });

    return await getNextAddPartnerStep({
      projectId: params.projectId,
      pcrId: params.pcrId,
      pcrItemId: params.itemId,
      context,
      toSummary: input.button_submit === "saveAndReturn",
      stepNumber: params.step,
    });
  }
}
