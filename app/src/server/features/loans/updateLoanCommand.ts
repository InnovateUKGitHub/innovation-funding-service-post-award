import { LoanDtoWithTotals } from "@framework/dtos";
import { Authorisation, IContext, ProjectRole } from "@framework/types";
import { GetLoan } from "@server/features/loans/getLoan";
import { BadRequestError, CommandBase, ValidationError } from "@server/features/common";
import { LoanDtoValidator } from "@ui/validators/loanValidator";
import { GetLoanDocumentsQuery } from "@server/features/documents/getLoanDocuments";
import { ISalesforceLoan } from "@server/repositories";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";

export class UpdateLoanCommand extends CommandBase<boolean> {
  constructor(
    private readonly projectId: string,
    private readonly loanId: string,
    private readonly loan: LoanDtoWithTotals,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.FinancialContact);
  }

  protected async run(context: IContext): Promise<boolean> {
    if (this.loanId !== this.loan.id) throw new BadRequestError();

    const loanQuery = new GetLoan(false, this.projectId, this.loanId);
    const loanDocumentsQuery = new GetLoanDocumentsQuery(this.projectId, this.loanId);

    const existingLoan = await context.runQuery(loanQuery);
    const existingLoanDocuments = await context.runQuery(loanDocumentsQuery);

    const validationResult = new LoanDtoValidator(this.loan, existingLoanDocuments, true);

    if (!validationResult.isValid) {
      throw new ValidationError(validationResult);
    }

    if (this.loan.comments.length) {
      const entityToUpdate: Updatable<ISalesforceLoan> = {
        Id: existingLoan.id,
        Loan_UserComments__c: this.loan.comments,
      };

      await context.repositories.loans.update(entityToUpdate);
    }

    return true;
  }
}
