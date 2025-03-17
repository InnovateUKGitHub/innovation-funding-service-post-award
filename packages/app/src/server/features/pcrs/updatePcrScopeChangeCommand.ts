import { ProjectRolePermissionBits } from "@framework/constants/project";
import { PcrScopeChangeDto, ScopeChangeFormType } from "@framework/dtos/pcrDtos";

import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
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
import { getPcrItemStatus, mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

type ScopeChangeSchema =
  | PcrScopeChangeSchemaType
  | PcrScopeChangePublicDescriptionSchemaType
  | PcrScopeChangeProjectSummarySchemaType;

type SchemaOutput =
  | z.output<PcrScopeChangeSchemaType>
  | z.output<PcrScopeChangePublicDescriptionSchemaType>
  | z.output<PcrScopeChangeProjectSummarySchemaType>;

export class UpdatePcrScopeChangeCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  ScopeChangeSchema,
  PcrScopeChangeDto
> {
  public readonly runnableName: string = "UpdatePcrScopeChangeCommand";
  protected readonly projectId: ProjectId;
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
          projectSummary: this.dto.projectSummary,
          markedAsComplete: this.dto.markedAsComplete ?? false,
        };
      case FormTypes.PcrChangeProjectScopeProposedPublicDescriptionStepSaveAndContinue:
        return {
          form: this.form,
          publicDescription: this.dto.publicDescription,
          markedAsComplete: this.dto.markedAsComplete ?? false,
        };
      case FormTypes.PcrChangeProjectScopeSummary:
        return {
          form: this.form,
          publicDescription: this.dto.publicDescription,
          projectSummary: this.dto.projectSummary,
          markedAsComplete: this.dto.markedAsComplete ?? false,
        };
    }
  }

  private schemaIsSummarySchema(schemaOutput: SchemaOutput): schemaOutput is z.output<PcrScopeChangeSchemaType> {
    return schemaOutput.form === FormTypes.PcrChangeProjectScopeSummary;
  }

  protected async runRepositoryCommands(context: IContext, validatedData: SchemaOutput): Promise<boolean> {
    if (this.schemaIsSummarySchema(validatedData)) {
      const nextStatus = getPcrItemStatus(validatedData.markedAsComplete);
      await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: this.pcrItemId,
        Acc_MarkedasComplete__c: nextStatus,
      });
    } else if (validatedData.form === FormTypes.PcrChangeProjectScopeProposedProjectSummaryStepSaveAndContinue) {
      await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: this.pcrItemId,
        Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
        Acc_NewProjectSummary__c: validatedData?.projectSummary ?? null,
      });
    } else if (validatedData.form === FormTypes.PcrChangeProjectScopeProposedPublicDescriptionStepSaveAndContinue) {
      await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: this.pcrItemId,
        Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
        Acc_NewPublicDescription__c: validatedData?.publicDescription ?? null,
      });
    }

    return true;
  }
}
