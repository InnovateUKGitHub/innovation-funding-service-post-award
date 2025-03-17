import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerProjectLocationDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";

import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import {
  getProjectLocationSchema,
  ProjectLocationSchemaType,
} from "@ui/pages/pcrs/addPartner/steps/schemas/projectLocation.zod";
import { PCRProjectLocationMapper } from "@framework/mappers/projectLocation";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export class UpdatePcrAddPartnerProjectLocationCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  ProjectLocationSchemaType,
  PcrAddPartnerProjectLocationDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerProjectLocationCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerProjectLocationStep;
  protected readonly dto: PcrAddPartnerProjectLocationDto;

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
    pcr: PcrAddPartnerProjectLocationDto;
    form: FormTypes.PcrAddPartnerProjectLocationStep;
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
    return { schema: getProjectLocationSchema(!!this.dto.markedAsComplete), errorMap: addPartnerErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      button_submit: this.dto.button_submit,
      markedAsComplete: !!this.dto.markedAsComplete,
      projectLocation: this.dto.projectLocation ?? 0,
      projectCity: this.dto.projectCity,
      projectPostcode: this.dto.projectPostcode,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<ProjectLocationSchemaType>,
  ): Promise<boolean> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_ProjectPostcode__c: validatedData.projectPostcode,
      Acc_ProjectCity__c: validatedData.projectCity,
      Acc_Location__c: new PCRProjectLocationMapper().mapToSalesforcePCRProjectLocation(validatedData.projectLocation),
    });

    return true;
  }
}
