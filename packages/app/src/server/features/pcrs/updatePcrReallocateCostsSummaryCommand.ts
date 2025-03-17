import { ProjectRolePermissionBits } from "@framework/constants/project";
import { ReallocateCostsSummaryDto } from "@framework/dtos/pcrDtos";
import { Authorisation } from "@framework/types/authorisation";
import { IContext } from "@framework/types/IContext";
import { ZodAuthorisedAsyncCommandBase } from "../common/commandBase";
import { z } from "zod";
import { getPcrItemStatus } from "@server/repositories/projectChangeRequestRepository";
import { FormTypes } from "@ui/zod/FormTypes";
import {
  reallocateCostsSummaryErrorMap,
  ReallocateCostsSummaryValidatorSchema,
  reallocateCostsSummaryValidator,
} from "@ui/pages/pcrs/reallocateCosts/summary/ReallocateCostsSummary.zod";
import { parseCurrency } from "@framework/util/numberHelper";

export class UpdatePcrReallocateCostsSummaryCommand extends ZodAuthorisedAsyncCommandBase<
  boolean,
  ReallocateCostsSummaryValidatorSchema,
  ReallocateCostsSummaryDto
> {
  public readonly runnableName: string = "UpdatePcrReallocateCostsSummaryCommand";
  protected readonly projectId: ProjectId;
  private readonly pcrItemId: PcrItemId;
  private readonly form: FormTypes.PcrReallocateCostsSummary;
  protected readonly dto: ReallocateCostsSummaryDto;

  constructor({
    projectId,
    pcrItemId,
    pcr,
    form,
  }: {
    projectId: ProjectId;
    pcrItemId: PcrItemId;
    pcr: ReallocateCostsSummaryDto;
    form: FormTypes.PcrReallocateCostsSummary;
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
      schema: reallocateCostsSummaryValidator,
      errorMap: reallocateCostsSummaryErrorMap,
    };
  }

  protected async mapToZod() {
    return {
      markedAsComplete: this.dto.markedAsComplete ?? false,
      grantMovingOverFinancialYear: this.dto.grantMovingOverFinancialYear,
      financialVirements: this.dto.financialVirements,
      form: this.form,
    };
  }

  protected async runRepositoryCommands(
    context: IContext,
    validatedData: z.output<ReallocateCostsSummaryValidatorSchema>,
  ): Promise<boolean> {
    await context.repositories.projectChangeRequests.updateSingleSalesforceItem({
      Id: this.pcrItemId,
      Acc_MarkedasComplete__c: getPcrItemStatus(validatedData.markedAsComplete),
      Acc_GrantMovingOverFinancialYear__c: parseCurrency(validatedData.grantMovingOverFinancialYear),
    });

    return true;
  }
}
