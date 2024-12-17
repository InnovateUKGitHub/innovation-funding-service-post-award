import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrRenamePartnerDto, RenamePartnerFormType } from "@framework/dtos/pcrDtos";

import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { BadRequestError, InActiveProjectError } from "../common/appError";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";

import {
  renamePartnerErrorMap,
  renamePartnerSchema,
  RenamePartnerSchema,
} from "@ui/pages/pcrs/renamePartner/renamePartner.zod";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { zodEmptySchema, ZodEmptySchema } from "@ui/zod/helperValidators/helperValidators.zod";

export class UpdatePcrRenamePartnerCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  RenamePartnerSchema | ZodEmptySchema,
  PcrRenamePartnerDto
> {
  public readonly runnableName: string = "UpdatePCRRenamePartnerCommand";
  private readonly projectId: ProjectId;
  private readonly projectChangeRequestId: PcrId | PcrItemId;
  private readonly form: RenamePartnerFormType;
  protected readonly dto: PcrRenamePartnerDto;

  constructor({
    projectId,
    projectChangeRequestId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    projectChangeRequestId: PcrId | PcrItemId;
    pcr: PcrRenamePartnerDto;
    form: RenamePartnerFormType;
  }) {
    super();
    this.projectId = projectId;
    this.projectChangeRequestId = projectChangeRequestId;
    this.dto = pcr;
    this.form = form;
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.MonitoringOfficer);
  }

  protected async getZodSchema() {
    if (this.form === FormTypes.PcrRenamePartnerFilesStep) {
      return { schema: zodEmptySchema, errorMap: renamePartnerErrorMap };
    }
    return { schema: renamePartnerSchema, errorMap: renamePartnerErrorMap };
  }

  protected async mapToZod() {
    if (this.form === FormTypes.PcrRenamePartnerFilesStep) {
      return {};
    }
    return {
      markedAsComplete: this.dto.markedAsComplete ?? false,
      accountName: this.dto.accountName,
      existingAccountName: this.dto.existingAccountName,
      partnerId: this.dto.partnerId,
      form: this.form,
      projectId: this.projectId,
      pcrId: this.dto.pcrId,
      pcrItemId: this.dto.pcrItemId,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<RenamePartnerSchema>,
  ): Promise<boolean> {
    if (this.form === FormTypes.PcrRenamePartnerFilesStep) {
      return true;
    }
    const hasMismatchProjectId = this.projectId !== this.dto.projectId;
    const hasMismatchPcrId = this.projectChangeRequestId !== this.dto.pcrId;
    if (hasMismatchProjectId || hasMismatchPcrId) throw new BadRequestError();

    const { isActive: isProjectActive } = await context.runQuery(new GetProjectStatusQuery(this.projectId));
    if (!isProjectActive) throw new InActiveProjectError();

    await context.repositories.projectChangeRequests.updateSingleItem({
      id: this.dto.pcrItemId,
      status: this.dto.status,
      ...validatedData,
    });

    return true;
  }
}
