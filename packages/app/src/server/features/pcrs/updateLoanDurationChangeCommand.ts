import { ProjectRolePermissionBits } from "@framework/constants/project";
import { LoanDrawdownChangeDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { mapToPCRItemStatusLabel } from "@server/repositories/projectChangeRequestRepository";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  loanDrawdownChangeSchema,
  LoanDrawdownChangeSchema,
  loanDrawdownChangeSummarySchema,
  LoanDrawdownChangeSummarySchema,
  errorMap,
} from "@ui/pages/pcrs/loanDrawdownChange/loanDrawdownChange.zod";
import { combineDayMonthYear } from "@ui/components/atoms/Date";
import { parseCurrency } from "@framework/util/numberHelper";

export class UpdatePcrLoanDrawdownChangeCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  LoanDrawdownChangeSchema | LoanDrawdownChangeSummarySchema,
  LoanDrawdownChangeDto
> {
  public readonly runnableName: string = "UpdatePcrLoanDrawdownChangeCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrLoanDrawdownChange | FormTypes.PcrLoanDrawdownChangeSummary;
  protected readonly dto: LoanDrawdownChangeDto;

  constructor({
    projectId,
    pcrItemId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    pcrItemId: PcrItemId;
    pcr: LoanDrawdownChangeDto;
    form: FormTypes.PcrLoanDrawdownChange | FormTypes.PcrLoanDrawdownChangeSummary;
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
    if (this.form === FormTypes.PcrLoanDrawdownChange) {
      return {
        schema: loanDrawdownChangeSchema,
        errorMap,
      };
    } else if (this.form === FormTypes.PcrLoanDrawdownChangeSummary) {
      return {
        schema: loanDrawdownChangeSummarySchema,
        errorMap,
      };
    }

    throw new Error("there is no schema for this form type in loadDrawdownChange");
  }

  protected async mapToZod() {
    return {
      markedAsComplete: this.dto.markedAsComplete ?? false,
      loans: this.dto.loans,
      form: this.form,
    } as typeof this.form extends FormTypes.PcrLoanDrawdownChange
      ? z.input<LoanDrawdownChangeSchema>
      : z.input<LoanDrawdownChangeSummarySchema>;
  }

  private isDrawdownChange(
    data: z.output<LoanDrawdownChangeSchema> | z.output<LoanDrawdownChangeSummarySchema>,
  ): data is z.output<LoanDrawdownChangeSchema> {
    return data.form === FormTypes.PcrLoanDrawdownChange;
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<LoanDrawdownChangeSchema> | z.output<LoanDrawdownChangeSummarySchema>,
  ): Promise<boolean> {
    if (this.isDrawdownChange(validatedData)) {
      const virementUpdates = validatedData.loans
        .filter(x => x.isEditable)
        .map(x => ({
          Id: x.id,
          Acc_ProjectChangeRequest__c: this.pcrItemId,
          Loan_PeriodNumber__c: x.period,
          Loan_NewDrawdownValue__c: parseCurrency(x.newValue),
          Loan_NewDrawdownDate__c: combineDayMonthYear(x.newDate_day, x.newDate_month, x.newDate_year)?.toISOString(),
        }));

      await context.repositories.financialLoanVirements.updateVirements(virementUpdates);
    }

    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: mapToPCRItemStatusLabel(this.dto.status),
    });

    return true;
  }
}
