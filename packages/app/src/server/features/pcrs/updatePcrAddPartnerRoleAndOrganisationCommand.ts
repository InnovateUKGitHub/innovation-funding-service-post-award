import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerRoleAndOrganisationDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import {
  roleAndOrganisationSchema,
  RoleAndOrganisationSchemaType,
} from "@ui/pages/pcrs/addPartner/steps/schemas/roleAndOrganisation.zod";
import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { PcrPartnerTypeMapper, PcrProjectRoleMapper } from "@server/repositories/mappers/projectChangeRequestMapper";
import { PcrParticipantSizeMapper } from "@framework/mappers/participantSize";
import { getPCROrganisationType, PCROrganisationType, PCRParticipantSize } from "@framework/constants/pcrConstants";

export class UpdatePcrAddPartnerRoleAndOrganisationCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  RoleAndOrganisationSchemaType,
  PcrAddPartnerRoleAndOrganisationDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerRoleAndOrganisationCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerRoleAndOrganisationStep;
  protected readonly dto: PcrAddPartnerRoleAndOrganisationDto;

  constructor({
    projectId,
    pcrId,
    pcrItemId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    pcrId: PcrId;
    pcrItemId: PcrItemId;
    pcr: PcrAddPartnerRoleAndOrganisationDto;
    form: FormTypes.PcrAddPartnerRoleAndOrganisationStep;
  }) {
    super();
    this.projectId = projectId;
    this.pcrId = pcrId;
    this.pcrItemId = pcrItemId;
    this.dto = pcr;
    this.form = form;
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.MonitoringOfficer);
  }

  protected async getZodSchema() {
    return { schema: roleAndOrganisationSchema, errorMap: addPartnerErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      button_submit: this.dto.button_submit,
      projectRole: this.dto.projectRole,
      isCommercialWork: this.dto.isCommercialWork,
      partnerType: this.dto.partnerType,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<RoleAndOrganisationSchemaType>,
  ): Promise<boolean> {
    // It's not possible to come back to this page after it's submitted
    // so we can assume that the participant size hasn't explicitly been set by the user yet
    // and it's safe for us to reset it
    let participantSize = PCRParticipantSize.Unknown;

    const organisationType = getPCROrganisationType(validatedData.partnerType);
    if (organisationType === PCROrganisationType.Academic) {
      participantSize = PCRParticipantSize.Academic;
    }

    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(this.dto.status),
      Acc_CommercialWork__c: validatedData.isCommercialWork === "true",
      Acc_ParticipantType__c: new PcrPartnerTypeMapper().mapToSalesforcePCRPartnerType(validatedData.partnerType),
      Acc_ProjectRole__c: new PcrProjectRoleMapper().mapToSalesforcePCRProjectRole(validatedData.projectRole),
      Acc_ParticipantSize__c: new PcrParticipantSizeMapper().mapToSalesforcePCRParticipantSize(participantSize),
    });

    return true;
  }
}
