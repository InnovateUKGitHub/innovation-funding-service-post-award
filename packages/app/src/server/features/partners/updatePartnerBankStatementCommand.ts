import { GetByIdQuery } from "@server/features/partners/getByIdQuery";
import { BankDetailsTaskStatus } from "@framework/constants/partner";
import { ProjectRolePermissionBits } from "@framework/constants/project";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { PartnerDto } from "@framework/dtos/partnerDto";
import { UpdatePartnerBankStatementDto } from "@server/apis/partners";
import {
  BankStatementSchema,
  projectSetupBankStatementErrorMap,
  setupBankStatementSchema,
} from "@ui/pages/projects/setup/projectSetupBankStatement.zod";
import { BankDetailsTaskStatusMapper } from "@framework/mappers/bankTaskStatus";

export class UpdatePartnerBankStatementCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  BankStatementSchema,
  UpdatePartnerBankStatementDto
> {
  protected readonly projectId: ProjectId;
  protected readonly partnerId: PartnerId;
  public readonly runnableName: string = "UpdatePartnerBankStatementCommand";

  protected dto: UpdatePartnerBankStatementDto;

  private savedPartner: PartnerDto | null = null;

  constructor(projectId: ProjectId, partnerId: PartnerId, partner: UpdatePartnerBankStatementDto) {
    super();
    this.dto = partner;
    this.projectId = projectId;
    this.partnerId = partnerId;
  }

  async accessControl(auth: Authorisation) {
    return auth
      .forPartner(this.projectId, this.partnerId)
      .hasAnyRoles(ProjectRolePermissionBits.ProjectManager, ProjectRolePermissionBits.FinancialContact);
  }

  protected async getZodSchema(context: IContext) {
    this.savedPartner = await context.runQuery(new GetByIdQuery(this.partnerId));

    return {
      schema: setupBankStatementSchema,
      errorMap: projectSetupBankStatementErrorMap,
    };
  }

  protected async mapToZod() {
    return {
      form: this.dto.form,
      hasUploadedBankStatement: this.dto.hasUploadedBankStatement,
    };
  }

  protected async runRepositoryCommands(context: IContext) {
    await context.repositories.partners.update({
      Id: this.partnerId,
      Acc_BankCheckCompleted__c: new BankDetailsTaskStatusMapper().mapToSalesforce(BankDetailsTaskStatus.Complete),
    });
    return true;
  }
}
