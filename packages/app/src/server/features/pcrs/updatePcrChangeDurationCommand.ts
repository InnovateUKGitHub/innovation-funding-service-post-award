import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ChangeDurationFormType, PcrChangeDurationDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { pcrTimeExtensionSchema, TimeExtensionSchema, errorMap } from "@ui/pages/pcrs/timeExtension/timeExtension.zod";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";

export class UpdatePcrChangeDurationCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  TimeExtensionSchema,
  PcrChangeDurationDto
> {
  public readonly runnableName: string = "UpdatePcrChangeDurationCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: ChangeDurationFormType;
  protected readonly dto: PcrChangeDurationDto;

  constructor({
    projectId,
    pcrItemId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    pcrItemId: PcrItemId;
    pcr: PcrChangeDurationDto;
    form: ChangeDurationFormType;
  }) {
    super();
    this.projectId = projectId;
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
    return { schema: pcrTimeExtensionSchema, errorMap };
  }

  protected async mapToZod() {
    return {
      markedAsComplete: this.dto.markedAsComplete ?? false,
      timeExtension: this.dto.timeExtension,
      form: this.form,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<TimeExtensionSchema>,
  ): Promise<boolean> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(this.dto.status),
      Acc_AdditionalNumberofMonths__c: Number(validatedData.timeExtension),
    });

    return true;
  }
}
