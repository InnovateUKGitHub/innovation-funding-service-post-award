import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrScopeChangeDto, ScopeChangeFormType } from "@framework/dtos/pcrDtos";

import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { BadRequestError, InActiveProjectError } from "../common/appError";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  getPcrScopeChangeProjectSummarySchema,
  getPcrScopeChangePublicDescriptionSchema,
  PcrScopeChangeProjectSummarySchemaType,
  PcrScopeChangePublicDescriptionSchemaType,
  pcrScopeChangeSchema,
  PcrScopeChangeSchemaType,
  scopeChangeErrorMap,
} from "@ui/pages/pcrs/scopeChange/scopeChange.zod";

export class UpdatePCRScopeChangeCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  PcrScopeChangeSchemaType | PcrScopeChangePublicDescriptionSchemaType | PcrScopeChangeProjectSummarySchemaType,
  PcrScopeChangeDto
> {
  public readonly runnableName: string = "UpdatePCRScopeChangeCommand";
  private readonly projectId: ProjectId;
  private readonly projectChangeRequestId: PcrId | PcrItemId;
  private readonly form: ScopeChangeFormType;
  protected readonly dto: PcrScopeChangeDto;

  constructor({
    projectId,
    projectChangeRequestId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    projectChangeRequestId: PcrId | PcrItemId;
    pcr: PcrScopeChangeDto;
    form: ScopeChangeFormType;
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
    switch (this.form) {
      case FormTypes.PcrChangeProjectScopeProposedProjectSummaryStepSaveAndContinue:
        return { schema: getPcrScopeChangeProjectSummarySchema(false), errorMap: scopeChangeErrorMap };
      case FormTypes.PcrChangeProjectScopeProposedPublicDescriptionStepSaveAndContinue:
        return { schema: getPcrScopeChangePublicDescriptionSchema(false), errorMap: scopeChangeErrorMap };
      case FormTypes.PcrChangeProjectScopeSummary:
        return { schema: pcrScopeChangeSchema, errorMap: scopeChangeErrorMap };
    }
  }

  protected async mapToZod() {
    switch (this.form) {
      case FormTypes.PcrChangeProjectScopeProposedProjectSummaryStepSaveAndContinue:
        return {
          form: this.form,
          projectId: this.dto.projectId,
          pcrId: this.dto.pcrId,
          pcrItemId: this.dto.pcrItemId,
          projectSummary: this.dto.projectSummary,
        };
      case FormTypes.PcrChangeProjectScopeProposedPublicDescriptionStepSaveAndContinue:
        return {
          form: this.form,
          projectId: this.dto.projectId,
          pcrId: this.dto.pcrId,
          pcrItemId: this.dto.pcrItemId,
          publicDescription: this.dto.publicDescription,
        };
      case FormTypes.PcrChangeProjectScopeSummary:
        return {
          form: this.form,
          projectId: this.dto.projectId,
          pcrId: this.dto.pcrId,
          pcrItemId: this.dto.pcrItemId,
          publicDescription: this.dto.publicDescription,
          projectSummary: this.dto.projectSummary,
          markedAsComplete: this.dto.markedAsComplete ?? false,
        };
    }
  }

  protected async runRepositoryCommands(context: IContext): Promise<boolean> {
    const hasMismatchProjectId = this.projectId !== this.dto.projectId;
    const hasMismatchPcrId = this.projectChangeRequestId !== this.dto.pcrId;
    if (hasMismatchProjectId || hasMismatchPcrId) throw new BadRequestError();

    const { isActive: isProjectActive } = await context.runQuery(new GetProjectStatusQuery(this.projectId));
    if (!isProjectActive) throw new InActiveProjectError();

    await context.repositories.projectChangeRequests.updateSingleItem({
      id: this.dto.pcrItemId,
      ...this.dto,
    });

    return true;
  }
}
