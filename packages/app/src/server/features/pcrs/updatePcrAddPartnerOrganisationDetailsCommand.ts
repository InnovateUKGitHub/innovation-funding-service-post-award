import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerOrganisationDetailsDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";

import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import {
  getOrganisationDetailsSchema,
  OrganisationDetailsSchemaType,
} from "@ui/pages/pcrs/addPartner/steps/schemas/organisationDetails.zod";
import { PcrParticipantSizeMapper } from "@framework/mappers/participantSize";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export class UpdatePcrAddPartnerOrganisationDetailsCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  OrganisationDetailsSchemaType,
  PcrAddPartnerOrganisationDetailsDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerOrganisationDetailsCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerOrganisationDetailsStep;
  protected readonly dto: PcrAddPartnerOrganisationDetailsDto;

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
    pcr: PcrAddPartnerOrganisationDetailsDto;
    form: FormTypes.PcrAddPartnerOrganisationDetailsStep;
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
    return {
      schema: getOrganisationDetailsSchema(!!this.dto.markedAsComplete),
      errorMap: addPartnerErrorMap,
    };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      button_submit: this.dto.button_submit,
      markedAsComplete: !!this.dto.markedAsComplete,
      participantSize: this.dto.participantSize,
      numberOfEmployees: this.dto.numberOfEmployees,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<OrganisationDetailsSchemaType>,
  ): Promise<boolean> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_ParticipantSize__c: new PcrParticipantSizeMapper().mapToSalesforcePCRParticipantSize(
        validatedData.participantSize,
      ),
      Acc_Employees__c: validatedData.numberOfEmployees,
    });

    return true;
  }
}
