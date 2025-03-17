import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrAddPartnerProjectManagerDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";

import { addPartnerErrorMap } from "@ui/pages/pcrs/addPartner/addPartnerSummary.zod";
import { PcrContactRoleMapper } from "@framework/mappers/pcr";
import { PCRContactRole, PCRItemStatus } from "@framework/constants/pcrConstants";
import {
  getProjectManagerSchema,
  ProjectManagerSchemaType,
} from "@ui/pages/pcrs/addPartner/steps/schemas/projectManager.zod";

export class UpdatePcrAddPartnerProjectManagerCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  ProjectManagerSchemaType,
  PcrAddPartnerProjectManagerDto
> {
  public readonly runnableName: string = "UpdatePcrAddPartnerProjectManagerCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrAddPartnerProjectManagerStep;
  protected readonly dto: PcrAddPartnerProjectManagerDto;

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
    pcr: PcrAddPartnerProjectManagerDto;
    form: FormTypes.PcrAddPartnerProjectManagerStep;
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
    return { schema: getProjectManagerSchema(!!this.dto.markedAsComplete), errorMap: addPartnerErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.form,
      button_submit: this.dto.button_submit,
      markedAsComplete: !!this.dto.markedAsComplete,
      contact2Email: this.dto.contact2Email,
      contact2Forename: this.dto.contact2Forename,
      contact2Surname: this.dto.contact2Surname,
      contact2Phone: this.dto.contact2Phone,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<ProjectManagerSchemaType>,
  ): Promise<boolean> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      Acc_Contact2ProjectRole__c: new PcrContactRoleMapper().mapToSalesforcePCRProjectRole(
        PCRContactRole.ProjectManager,
      ),
      Acc_Contact2Forename__c: validatedData.contact2Forename,
      Acc_Contact2Surname__c: validatedData.contact2Surname,
      Acc_Contact2Phone__c: validatedData.contact2Phone,
      Acc_Contact2EmailAddress__c: validatedData.contact2Email,
    });

    return true;
  }
}
