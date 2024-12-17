import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ChangeDurationFormType, PcrChangeDurationDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { pcrTimeExtensionSchema, TimeExtensionSchema, errorMap } from "@ui/pages/pcrs/timeExtension/timeExtension.zod";

export class UpdatePcrChangeDurationCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  TimeExtensionSchema,
  PcrChangeDurationDto
> {
  public readonly runnableName: string = "UpdatePcrChangeDurationCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: ChangeDurationFormType;
  protected readonly dto: PcrChangeDurationDto;

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
    pcr: PcrChangeDurationDto;
    form: ChangeDurationFormType;
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
    return { schema: pcrTimeExtensionSchema, errorMap };
  }

  protected async mapToZod() {
    return {
      markedAsComplete: this.dto.markedAsComplete ?? false,
      timeExtension: String(this.dto.offsetMonths),
      form: this.form,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<TimeExtensionSchema>,
  ): Promise<boolean> {
    await context.repositories.projectChangeRequests.updateSingleItem({
      id: this.pcrItemId,
      projectId: this.projectId,
      pcrId: this.pcrId,
      status: this.dto.status,
      offsetMonths: Number(validatedData.timeExtension),
    });

    return true;
  }
}
