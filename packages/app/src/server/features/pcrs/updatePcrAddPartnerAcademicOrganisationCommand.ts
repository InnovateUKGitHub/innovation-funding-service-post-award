import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerAcademicOrganisationDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";

import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import {
  AcademicOrganisationSchemaType,
  getAcademicOrganisationSchema,
} from "@ui/pages/pcrs/addPartner/steps/schemas/academicOrganisation.zod";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export class UpdatePcrAddPartnerAcademicOrganisationCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  AcademicOrganisationSchemaType,
  PcrAddPartnerAcademicOrganisationDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerAcademicOrganisationCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerAcademicOrganisationStep;
  protected readonly dto: PcrAddPartnerAcademicOrganisationDto;

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
    pcr: PcrAddPartnerAcademicOrganisationDto;
    form: FormTypes.PcrAddPartnerAcademicOrganisationStep;
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
    return { schema: getAcademicOrganisationSchema(!!this.dto.markedAsComplete), errorMap: addPartnerErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      button_submit: this.dto.button_submit,
      organisationName: this.dto.organisationName,
      markedAsComplete: !!this.dto.markedAsComplete,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<AcademicOrganisationSchemaType>,
  ): Promise<boolean> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_OrganisationName__c: validatedData.organisationName,
    });

    return true;
  }
}
