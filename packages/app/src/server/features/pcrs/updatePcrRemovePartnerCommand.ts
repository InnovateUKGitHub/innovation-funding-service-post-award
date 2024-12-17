import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrRemovePartnerDto, RemovePartnerFormType } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { InActiveProjectError } from "../common/appError";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { zodEmptySchema, ZodEmptySchema } from "@ui/zod/helperValidators/helperValidators.zod";
import {
  removePartnerErrorMap,
  removePartnerSchema,
  RemovePartnerSchema,
} from "@ui/pages/pcrs/removePartner/removePartner.zod";

export class UpdatePcrRemovePartnerCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  RemovePartnerSchema | ZodEmptySchema,
  PcrRemovePartnerDto
> {
  public readonly runnableName: string = "UpdatePcrRemovePartnerCommand";
  private readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: RemovePartnerFormType;
  protected readonly dto: PcrRemovePartnerDto;

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
    pcr: PcrRemovePartnerDto;
    form: RemovePartnerFormType;
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
    if (this.form === FormTypes.PcrRemovePartnerFilesStep) {
      return { schema: zodEmptySchema, errorMap: removePartnerErrorMap };
    }
    return { schema: removePartnerSchema, errorMap: removePartnerErrorMap };
  }

  protected async mapToZod() {
    if (this.form === FormTypes.PcrRemovePartnerFilesStep) {
      return {};
    }
    return {
      markedAsComplete: this.dto.markedAsComplete ?? false,
      removalPeriod: this.dto.removalPeriod,
      numberOfPeriods: this.dto.numberOfPeriods,
      partnerId: this.dto.partnerId,
      form: this.form,
      projectId: this.projectId,
      pcrId: this.dto.pcrId,
      pcrItemId: this.dto.pcrItemId,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<RemovePartnerSchema>,
  ): Promise<boolean> {
    if (this.form === FormTypes.PcrRemovePartnerFilesStep) {
      return true;
    }

    const { isActive: isProjectActive } = await context.runQuery(new GetProjectStatusQuery(this.projectId));
    if (!isProjectActive) throw new InActiveProjectError();

    await context.repositories.projectChangeRequests.updateSingleItem({
      id: this.pcrItemId,
      projectId: this.projectId,
      pcrId: this.pcrId,
      status: this.dto.status,
      ...validatedData,
    });

    return true;
  }
}
