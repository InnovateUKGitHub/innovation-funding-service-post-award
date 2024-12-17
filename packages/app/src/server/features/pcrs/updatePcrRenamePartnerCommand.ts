import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrRenamePartnerDto, RenamePartnerFormType } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";

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
  public readonly runnableName: string = "UpdatePcrRenamePartnerCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: RenamePartnerFormType;
  protected readonly dto: PcrRenamePartnerDto;

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
    pcr: PcrRenamePartnerDto;
    form: RenamePartnerFormType;
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

    await context.repositories.projectChangeRequests.updateSingleItem({
      id: this.pcrItemId,
      status: this.dto.status,
      ...validatedData,
      pcrId: this.pcrId,
    });

    return true;
  }
}
