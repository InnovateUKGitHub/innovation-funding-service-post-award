import { ProjectRolePermissionBits } from "@framework/constants/project";
import { LoanDrawdownExtensionDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import {
  loanDrawdownExtensionSchema,
  LoanDrawdownExtensionSchemaType,
  errorMap,
} from "@ui/pages/pcrs/loanDrawdownExtension/loanDrawdownExtension.zod";
import { FormTypes } from "@ui/zod/FormTypes";

export class UpdatePcrLoanDurationExtensionCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  LoanDrawdownExtensionSchemaType,
  LoanDrawdownExtensionDto
> {
  public readonly runnableName: string = "UpdatePcrLoanDurationExtensionCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrLoanDurationChange | FormTypes.PcrLoanDurationChangeSummary;
  protected readonly dto: LoanDrawdownExtensionDto;

  constructor({
    projectId,
    pcrItemId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    pcrItemId: PcrItemId;
    pcr: LoanDrawdownExtensionDto;
    form: FormTypes.PcrLoanDurationChange | FormTypes.PcrLoanDurationChangeSummary;
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
    return {
      schema: loanDrawdownExtensionSchema,
      errorMap,
    };
  }

  protected async mapToZod() {
    return {
      markedAsComplete: this.dto.markedAsComplete ?? false,
      availabilityPeriodChange: this.dto.availabilityPeriodChange,
      extensionPeriodChange: this.dto.extensionPeriodChange,
      repaymentPeriodChange: this.dto.repaymentPeriodChange,
      availabilityPeriod: this.dto.availabilityPeriod ?? 0,
      extensionPeriod: this.dto.extensionPeriod ?? 0,
      repaymentPeriod: this.dto.repaymentPeriod ?? 0,
      form: this.form,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<LoanDrawdownExtensionSchemaType>,
  ): Promise<boolean> {
    if (this.form === FormTypes.PcrLoanDurationChangeSummary) {
      await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: this.pcrItemId,
        Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(this.dto.status),
      });
    } else {
      await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
        Id: this.pcrItemId,
        Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(this.dto.status),
        Loan_ExtensionPeriodChange__c: Number(validatedData.extensionPeriodChange) - validatedData.extensionPeriod,
        Loan_RepaymentPeriodChange__c: Number(validatedData.repaymentPeriodChange) - validatedData.repaymentPeriod,
        Acc_AdditionalNumberofMonths__c:
          Number(validatedData.availabilityPeriodChange) - validatedData.availabilityPeriod,
      });
    }

    return true;
  }
}
