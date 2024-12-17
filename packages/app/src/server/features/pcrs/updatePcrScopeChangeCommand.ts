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
import { z } from "zod";

type ScopeChangeSchema =
  | PcrScopeChangeSchemaType
  | PcrScopeChangePublicDescriptionSchemaType
  | PcrScopeChangeProjectSummarySchemaType;

export class UpdatePcrScopeChangeCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  ScopeChangeSchema,
  PcrScopeChangeDto
> {
  public readonly runnableName: string = "UpdatePcrScopeChangeCommand";
  private readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: ScopeChangeFormType;
  protected readonly dto: PcrScopeChangeDto;

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
    pcr: PcrScopeChangeDto;
    form: ScopeChangeFormType;
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

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<ScopeChangeSchema>,
  ): Promise<boolean> {
    const hasMismatchProjectId = this.projectId !== this.dto.projectId;
    const hasMismatchPcrId = this.pcrId !== this.dto.pcrId;
    if (hasMismatchProjectId || hasMismatchPcrId) throw new BadRequestError();

    const { isActive: isProjectActive } = await context.runQuery(new GetProjectStatusQuery(this.projectId));
    if (!isProjectActive) throw new InActiveProjectError();

    await context.repositories.projectChangeRequests.updateSingleItem({
      id: this.pcrItemId,
      status: this.dto.status,
      ...validatedData,
      pcrId: this.pcrId,
    });

    return true;
  }
}
