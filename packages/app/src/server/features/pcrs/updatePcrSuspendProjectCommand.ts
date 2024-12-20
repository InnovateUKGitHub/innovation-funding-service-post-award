import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrSuspendProjectDto, SuspendProjectFormType } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  projectSuspensionSchema,
  pcrProjectSuspensionErrorMap,
  pcrProjectSuspensionSummarySchema,
  ProjectSuspensionSchema,
  ProjectSuspensionSummarySchema,
} from "@ui/pages/pcrs/suspendProject/suspendProject.zod";
import { combineDate } from "@ui/components/atoms/Date";

const isSummaryData = (
  data: z.output<ProjectSuspensionSchema> | z.output<ProjectSuspensionSummarySchema>,
): data is z.output<ProjectSuspensionSummarySchema> => data.form === FormTypes.PcrProjectSuspensionSummary;

const isStepData = (
  data: z.output<ProjectSuspensionSchema> | z.output<ProjectSuspensionSummarySchema>,
): data is z.output<ProjectSuspensionSchema> => data.form === FormTypes.PcrProjectSuspensionStep;

export class UpdatePcrSuspendProjectCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  ProjectSuspensionSchema | ProjectSuspensionSummarySchema,
  PcrSuspendProjectDto
> {
  public readonly runnableName: string = "UpdatePcrSuspendProjectCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: SuspendProjectFormType;
  protected readonly dto: PcrSuspendProjectDto;

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
    pcr: PcrSuspendProjectDto;
    form: SuspendProjectFormType;
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
    if (this.form === FormTypes.PcrProjectSuspensionStep) {
      return { schema: projectSuspensionSchema, errorMap: pcrProjectSuspensionErrorMap };
    }
    return { schema: pcrProjectSuspensionSummarySchema, errorMap: pcrProjectSuspensionErrorMap };
  }

  protected async mapToZod() {
    if (this.form === FormTypes.PcrProjectSuspensionStep) {
      return {
        projectStartDate: new Date(this.dto.projectStartDate),
        projectEndDate: new Date(this.dto.projectEndDate),
        markedAsComplete: this.dto.markedAsComplete ?? false,
        suspensionStartData_month: this.dto.suspensionStartDate_month,
        suspensionStartDate_year: this.dto.suspensionStartDate_year,
        suspensionEndDate_month: this.dto.suspensionEndDate_month,
        suspensionEndDate_year: this.dto.suspensionEndDate_year,
        suspensionStartDate: "",
        suspensionEndDate: "",
        form: this.form,
      };
    }
    return {
      form: this.form,
      markedAsComplete: this.dto.markedAsComplete ?? false,
      suspensionStartDate: this.dto.suspensionStartDate,
      suspensionEndDate: this.dto.suspensionEndDate,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<ProjectSuspensionSchema> | z.output<ProjectSuspensionSummarySchema>,
  ): Promise<boolean> {
    if (isStepData(validatedData)) {
      await context.repositories.projectChangeRequests.updateSingleItem({
        id: this.pcrItemId,
        projectId: this.projectId,
        pcrId: this.pcrId,
        status: this.dto.status,
        suspensionStartDate: combineDate(
          validatedData.suspensionStartDate_month,
          validatedData.suspensionStartDate_year,
          true,
        ),
        suspensionEndDate: combineDate(
          validatedData.suspensionEndDate_month,
          validatedData.suspensionEndDate_year,
          false,
        ),
      });
    } else if (isSummaryData(validatedData)) {
      await context.repositories.projectChangeRequests.updateSingleItem({
        id: this.pcrItemId,
        projectId: this.projectId,
        pcrId: this.pcrId,
        status: this.dto.status,
        suspensionStartDate: validatedData.suspensionStartDate,
      });
    }
    return true;
  }
}
