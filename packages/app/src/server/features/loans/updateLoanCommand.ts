import { ProjectRolePermissionBits } from "@framework/constants/project";
import { LoanUpdateDto } from "@framework/dtos/loanDto";
import { LoanStatus } from "@framework/entities/loan-status";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { loanRequestErrorMap, loanRequestSchema, LoanRequestSchemaType } from "@ui/pages/loans/loanRequest.zod";
import { z } from "zod";

export class UpdateLoanCommand extends ZodAuthorisedAsyncCommandBase<boolean, LoanRequestSchemaType, LoanUpdateDto> {
  public readonly runnableName: string = "UpdateLoanCommand";
  protected readonly projectId: ProjectId;
  private readonly loanId: LoanId;
  protected readonly dto: LoanUpdateDto;

  constructor(projectId: ProjectId, loanId: LoanId, dto: LoanUpdateDto) {
    super();
    this.projectId = projectId;
    this.loanId = loanId;
    this.dto = dto;
  }

  async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRolePermissionBits.FinancialContact);
  }
  protected async getZodSchema() {
    return { schema: loanRequestSchema, errorMap: loanRequestErrorMap };
  }

  protected async mapToZod() {
    return {
      form: this.dto.form,
      comments: this.dto.comments,
      attachmentsCount: this.dto.attachmentsCount,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<LoanRequestSchemaType>,
  ): Promise<boolean> {
    await context.repositories.loans.update({
      Id: this.loanId,
      Loan_DrawdownStatus__c: LoanStatus.REQUESTED,
      Loan_UserComments__c: validatedData.comments,
    });
    return true;
  }
}
