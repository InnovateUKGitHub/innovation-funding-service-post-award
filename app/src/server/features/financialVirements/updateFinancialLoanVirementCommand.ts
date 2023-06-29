import { ProjectRole } from "@framework/constants/project";
import { FinancialLoanVirementDto } from "@framework/dtos/financialVirementDto";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ISalesforceFinancialLoanVirement } from "@server/repositories/financialLoanVirementRepository";
import { Updatable } from "@server/repositories/salesforceRepositoryBase";
import { FinancialLoanVirementDtoValidator } from "@ui/validation/validators/financialVirementDtoValidator";
import { InActiveProjectError, ValidationError } from "../common/appError";
import { CommandBase } from "../common/commandBase";
import { GetProjectStatusQuery } from "../projects/GetProjectStatus";

export class UpdateFinancialLoanVirementCommand extends CommandBase<boolean> {
  constructor(
    private readonly projectId: ProjectId,
    private readonly pcrItemId: PcrItemId,
    private readonly data: FinancialLoanVirementDto,
    private readonly submit: boolean,
  ) {
    super();
  }

  protected async accessControl(auth: Authorisation) {
    return auth.forProject(this.projectId).hasAnyRoles(ProjectRole.ProjectManager);
  }

  protected async run(context: IContext): Promise<boolean> {
    const { isActive: isProjectActive } = await context.runQuery(new GetProjectStatusQuery(this.projectId));

    if (!isProjectActive) throw new InActiveProjectError();

    const validator = new FinancialLoanVirementDtoValidator(this.data, true, this.submit);

    if (!validator.isValid) throw new ValidationError(validator);

    const updates = await this.findVirementToUpdate(context);

    if (updates.length) {
      await context.repositories.financialVirements.updateVirements(updates);
    }

    return true;
  }

  private async findVirementToUpdate(context: IContext): Promise<Updatable<ISalesforceFinancialLoanVirement>[]> {
    const existingVirements = await context.repositories.financialLoanVirements.getForPcr(this.pcrItemId);
    const editableVirements = existingVirements.filter(x => x.isEditable);

    return editableVirements.reduce<Updatable<ISalesforceFinancialLoanVirement>[]>((updates, virement) => {
      const loan = this.data.loans.find(x => x.id === virement.id);

      // Note: Ignore records which have no matching inbound entry
      if (!loan) return updates;

      const updatedRecord = {
        Id: loan.id,
        Loan_NewDrawdownValue__c: loan.newValue,
        Loan_NewDrawdownDate__c: context.clock.formatRequiredSalesforceDate(loan.newDate),
      };

      return [...updates, updatedRecord];
    }, []);
  }
}
