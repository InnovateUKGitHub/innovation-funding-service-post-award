import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ReasoningDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { FormTypes } from "@ui/zod/FormTypes";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import {
  pcrReasoningErrorMap,
  PcrReasoningFilesSchema,
  pcrReasoningFilesSchema,
  pcrReasoningSchema,
  PcrReasoningSchema,
  pcrReasoningSummarySchema,
  PcrReasoningSummarySchema,
} from "@ui/pages/pcrs/reasoning/pcrReasoning.zod";
import { PCRItemStatus } from "@framework/constants/pcrConstants";

export class UpdatePcrReasoningCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  PcrReasoningSchema | PcrReasoningFilesSchema | PcrReasoningSummarySchema,
  ReasoningDto
> {
  public readonly runnableName: string = "UpdatePcrReasoningCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrId: PcrId;
  private readonly form: ReasoningDto["form"];
  protected readonly dto: ReasoningDto;

  constructor({
    projectId,
    pcrId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    pcrId: PcrId;
    pcr: ReasoningDto;
    form: ReasoningDto["form"];
  }) {
    super();
    this.projectId = projectId;
    this.pcrId = pcrId;
    this.dto = pcr;
    this.form = form;
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forProject(this.projectId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.MonitoringOfficer);
  }

  protected async getZodSchema() {
    if (this.form === FormTypes.PcrPrepareReasoningStep) {
      return { schema: pcrReasoningSchema, errorMap: pcrReasoningErrorMap };
    } else if (this.form === FormTypes.PcrPrepareReasoningFilesStep) {
      return { schema: pcrReasoningFilesSchema, errorMap: pcrReasoningErrorMap };
    } else if (this.form === FormTypes.PcrPrepareReasoningSummary) {
      return { schema: pcrReasoningSummarySchema, errorMap: pcrReasoningErrorMap };
    }

    throw new Error("invalid form type for pcr reasoning");
  }

  protected async mapToZod() {
    if (this.form === FormTypes.PcrPrepareReasoningStep) {
      return {
        reasoningComments: this.dto.reasoningComments,
        form: this.form,
      };
    } else if (this.form === FormTypes.PcrPrepareReasoningFilesStep) {
      return {
        form: this.form,
      };
    } else if (this.form === FormTypes.PcrPrepareReasoningSummary) {
      return {
        markedAsComplete: !!this.dto.markedAsComplete,
        reasoningComments: this.dto.reasoningComments,
        form: this.form,
      };
    }
    throw new Error("invalid form type for pcr reasoning");
  }

  private isSummary(
    output: z.output<PcrReasoningSchema> | z.output<PcrReasoningSummarySchema> | z.output<PcrReasoningFilesSchema>,
  ): output is z.output<PcrReasoningSummarySchema> {
    return output.form === FormTypes.PcrPrepareReasoningSummary;
  }

  private isReasonStep(
    output: z.output<PcrReasoningSchema> | z.output<PcrReasoningSummarySchema> | z.output<PcrReasoningFilesSchema>,
  ): output is z.output<PcrReasoningSchema> {
    return output.form === FormTypes.PcrPrepareReasoningStep;
  }

  private isFilesStep(
    output: z.output<PcrReasoningSchema> | z.output<PcrReasoningSummarySchema> | z.output<PcrReasoningFilesSchema>,
  ): output is z.output<PcrReasoningFilesSchema> {
    return output.form === FormTypes.PcrPrepareReasoningFilesStep;
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData:
      | z.output<PcrReasoningSchema>
      | z.output<PcrReasoningSummarySchema>
      | z.output<PcrReasoningFilesSchema>,
  ): Promise<boolean> {
    if (this.isReasonStep(validatedData)) {
      await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: this.pcrId,
        Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
        Acc_Reasoning__c: validatedData.reasoningComments,
      });
    } else if (this.isFilesStep(validatedData)) {
      await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: this.pcrId,
        Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(PCRItemStatus.Incomplete),
      });
    } else if (this.isSummary(validatedData)) {
      await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: this.pcrId,
        Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(
          validatedData.markedAsComplete ? PCRItemStatus.Complete : PCRItemStatus.Incomplete,
        ),
      });
    }

    return true;
  }
}
